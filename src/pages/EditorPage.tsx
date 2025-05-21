import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlowsStore } from '@/store/flowsStore';
import { Flow, CustomNodeData } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FlowCanvas from '@/components/editor/FlowCanvas';
import LeftSidebar from '@/components/editor/LeftSidebar';
import RightSidebar from '@/components/editor/RightSidebar';
import BottomConsole from '@/components/editor/BottomConsole';
import {
  ReactFlowProvider,
  useReactFlow,
  // Removed direct use of RF state hooks and types not needed here
} from 'reactflow';
// getNodeDefinition is no longer needed here as it's used within editorStore
import { toast } from "@/hooks/use-toast"; // Keep toast for non-store related notifications if any
import { useEditorStore } from '@/store/editorStore'; // Import the new store
import { FlowExecutor } from '@/lib/flow-execution/FlowExecutor';
import { 
  VariableNodeExecutor, 
  LoggerNodeExecutor,
  ButtonNodeExecutor,
  OutputNodeExecutor,
  IfStatementNodeExecutor,
  SwitchNodeExecutor,    // New
  DelayNodeExecutor,     // New
  MergeNodeExecutor,     // New
  RandomNodeExecutor,    // New
  AiNodeExecutor         // New
} from '@/lib/flow-execution/node-executors';
import { NodeExecutor, NodeServices, ExecutionContext, ExecutionStatus } from '@/lib/flow-execution/types';


const EditorPageContent: React.FC = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const navigate = useNavigate();
  const { getFlow, updateFlow } = useFlowsStore();
  const [currentFlowDetails, setCurrentFlowDetails] = useState<Pick<Flow, 'id' | 'name'> | null>(null);
  
  // Selectors from useEditorStore
  const { 
    nodes, edges, selectedNode, viewport,
    loadFlowData, cleanupStore,
    onNodesChange, onEdgesChange, onConnect, _addCompleteNode,
    updateNodeData, deleteSelectedNode 
  } = useEditorStore(state => ({
    nodes: state.nodes,
    edges: state.edges,
    selectedNode: state.selectedNode,
    viewport: state.viewport,
    loadFlowData: state.loadFlowData,
    cleanupStore: state.cleanupStore,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    _addCompleteNode: state._addCompleteNode, // For FlowCanvas onDrop
    updateNodeData: state.updateNodeData,
    deleteSelectedNode: state.deleteSelectedNode,
  }));

  const reactFlowInstance = useReactFlow(); // Still needed for getViewport in auto-save

  // Effect for loading flow data and cleaning up store
  useEffect(() => {
    if (flowId) {
      const flow = getFlow(flowId);
      if (flow) {
        setCurrentFlowDetails({ id: flow.id, name: flow.name });
        loadFlowData(flow); // Load data into editorStore
      } else {
        toast({
          title: "Error: Flow Not Found",
          description: `The requested flow (ID: ${flowId}) could not be found.`,
          variant: "destructive",
        });
        navigate('/flows');
      }
    }
    // Cleanup when flowId changes or component unmounts
    return () => {
      cleanupStore();
    };
  }, [flowId, getFlow, navigate, loadFlowData, cleanupStore]);

  // Auto-save logic, now subscribing to editorStore's state
  useEffect(() => {
    const handler = setTimeout(() => {
      if (currentFlowDetails?.id && (nodes.length > 0 || edges.length > 0)) {
        console.log('Auto-saving flow from EditorPage (via editorStore)...', currentFlowDetails.id);
        const nodesToSave = nodes.map(n => ({
          ...n,
          data: { ...n.data, nodeTypeDefinition: undefined } 
        }));
        const flowDataToSave = { 
          nodes: nodesToSave, 
          edges, 
          viewport: viewport || reactFlowInstance.getViewport(), // Use store's viewport or instance's
        };
        updateFlow(currentFlowDetails.id, currentFlowDetails.name, flowDataToSave);
        // Toast for auto-save is now in editorStore or can be triggered here if preferred
        // For now, assuming editorStore does not handle this specific toast to avoid duplication if it were there.
        // If auto-save confirmation is desired here:
         toast({
           title: "Flow Auto-Saved",
           description: `Flow '${currentFlowDetails.name}' auto-saved.`,
         });
      }
    }, 3000);

    return () => clearTimeout(handler);
  }, [nodes, edges, viewport, currentFlowDetails, updateFlow, reactFlowInstance]);

  // Keydown listener for deleting selected node
  useEffect(() => {
    if (!selectedNode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        deleteSelectedNode(); // Call action from editorStore
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, deleteSelectedNode]);

  const handleRunFlow = async () => {
    if (!currentFlowDetails) {
      toast({ title: "Error", description: "No flow loaded to run.", variant: "destructive" });
      return;
    }

    const nodeServices: NodeServices = {
      logMessage: (message: string, nodeId?: string) => {
        console.log(`[NodeService Log${nodeId ? ` - ${nodeId}` : ''}]: ${message}`);
        // This could also push to a global log if desired, or use context.addLog if context is available here
      }
    };

    const executors = new Map<string, NodeExecutor>();
    executors.set('variableNode', new VariableNodeExecutor());
    executors.set('loggerNode', new LoggerNodeExecutor());
    executors.set('buttonNode', new ButtonNodeExecutor());
    executors.set('outputNode', new OutputNodeExecutor());
    executors.set('ifStatementNode', new IfStatementNodeExecutor());
    executors.set('switchNode', new SwitchNodeExecutor());
    executors.set('delayNode', new DelayNodeExecutor());
    executors.set('mergeNode', new MergeNodeExecutor());
    executors.set('randomNode', new RandomNodeExecutor());
    executors.set('aiNode', new AiNodeExecutor());

    const flowExecutor = new FlowExecutor(executors, nodeServices);

    // Get current state directly from the store for execution
    const { nodes: currentNodes, edges: currentEdges, selectedNode: currentSelectedNode } = useEditorStore.getState();

    let startNodeId: string | undefined = undefined;
    if (currentSelectedNode && currentSelectedNode.type === 'buttonNode') {
      startNodeId = currentSelectedNode.id;
    } else {
      const firstButtonNode = currentNodes.find(n => n.type === 'buttonNode');
      if (firstButtonNode) {
        startNodeId = firstButtonNode.id;
      }
    }

    if (!startNodeId) {
      toast({ 
        title: "Execution Error", 
        description: "Cannot run flow: No Button Node found to start execution or select one.", 
        variant: "destructive" 
      });
      return;
    }

    toast({ title: "Flow Execution", description: `Starting flow execution of '${currentFlowDetails.name}'...`, variant: "default" });

    const executionResult: ExecutionContext = await flowExecutor.run(currentNodes, currentEdges, startNodeId);

    console.log("Flow Execution Context Result:", executionResult);
    console.log("Execution Logs:", executionResult.logs);

    if (executionResult.status === ExecutionStatus.COMPLETED) {
      toast({ title: "Flow Execution", description: "Flow completed successfully.", variant: "default" });
    } else if (executionResult.status === ExecutionStatus.FAILED) {
      toast({ 
        title: "Flow Execution Error", 
        description: "Flow execution failed. Check console and execution logs for details.", 
        variant: "destructive" 
      });
    }
    // Potentially handle other statuses like PENDING_INPUT if the FlowExecutor supports them more actively
  };

  if (!currentFlowDetails) {
    return <div className="p-4">Loading flow details or flow not found...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <nav className="bg-background border-b h-14 flex items-center justify-between px-4">
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate('/flows')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flows
          </Button>
        </div>
        <h1 className="text-lg font-semibold">{currentFlowDetails.name}</h1>
        <div>
          <Button size="sm" onClick={handleRunFlow}>Run Flow</Button>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            addNode={_addCompleteNode} // Use _addCompleteNode for onDrop in FlowCanvas
          />
          <BottomConsole />
        </div>
        <RightSidebar
          selectedNode={selectedNode}
          onNodeDataChange={updateNodeData} // Use updateNodeData action
        />
      </div>
    </div>
  );
};

// Wrap EditorPageContent with ReactFlowProvider as it uses useReactFlow
const EditorPage: React.FC = () => (
  <ReactFlowProvider>
    <EditorPageContent />
  </ReactFlowProvider>
);

export default EditorPage;
