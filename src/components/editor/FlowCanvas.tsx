// Essential ReactFlow imports
import ReactFlow, {
  Controls, Background, MiniMap, ReactFlowProvider,
  useNodesState, useEdgesState, addEdge, useReactFlow,
  Node, Edge, Connection, NodeChange, applyNodeChanges, NodeProps // Ensure applyNodeChanges and NodeProps are imported
} from 'reactflow';

// Base styles and other necessary imports
import 'reactflow/dist/style.css';
import { useFlowsStore } from '@/store/flowsStore';
import { Flow, CustomNodeData } from '@/types';
import BaseNode from '@/components/nodes/BaseNode';
import { nodeRegistry, getNodeDefinition } from '@/lib/nodeRegistry';
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useEffect } from 'react'; // React is needed for FC and hooks

// Define nodeTypes based on the registry
const nodeTypes = nodeRegistry.reduce((acc, nodeDef) => {
  acc[nodeDef.type] = BaseNode; // All nodes use BaseNode for now
  return acc;
}, {} as Record<string, React.ComponentType<NodeProps<any>>>);


interface FlowCanvasProps {
  flow: Flow;
  setSelectedNode: (node: Node<CustomNodeData> | null) => void;
  // Callback to pass the internal node updater function to EditorPage
  onCanvasReady: (updater: (nodeId: string, newData: Partial<CustomNodeData>) => void) => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ flow, setSelectedNode, onCanvasReady }) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState<CustomNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { updateFlow } = useFlowsStore();
  const reactFlowInstance = useReactFlow();

  // Effect to initialize or update nodes/edges when the flow prop changes
  useEffect(() => {
    const initialNodes = (flow.data?.nodes || []).map(n => {
      const definition = getNodeDefinition(n.type); // Get the full definition
      return {
        ...n,
        // Ensure data includes nodeTypeDefinition and defaultData merged with saved data
        data: {
          ...(definition?.defaultData || {}), // Start with default data from definition
          ...n.data,                         // Override with any saved custom data for the node instance
          nodeTypeDefinition: definition!,    // Attach the full definition for BaseNode to use
        } as CustomNodeData,
      };
    });
    setNodes(initialNodes);
    setEdges(flow.data?.edges || []);
    // When flow changes, reset selected node in parent (EditorPage)
    setSelectedNode(null); 
  }, [flow, setNodes, setEdges, setSelectedNode]); 

  // Debounced auto-save effect (Step 5)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only save if there's an active flow and some data exists
      if (flow.id && (nodes.length > 0 || edges.length > 0 || flow.data?.nodes?.length > 0 || flow.data?.edges?.length > 0)) {
        console.log('Auto-saving flow...', flow.id);
        // Strip nodeTypeDefinition before saving to avoid circular references and keep storage lean
        const nodesToSave = nodes.map(n => ({
          ...n,
          data: { ...n.data, nodeTypeDefinition: undefined } 
        }));
        const flowDataToSave = { 
          nodes: nodesToSave, 
          edges, 
          viewport: reactFlowInstance.getViewport() 
        };
        updateFlow(flow.id, flow.name, flowDataToSave);
      }
    }, 3000); // 3-second debounce

    return () => clearTimeout(handler);
  }, [nodes, edges, flow.id, flow.name, updateFlow, reactFlowInstance]);

  // Custom onNodesChange handler to also manage selectedNode state (Step 1)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Apply changes to internal nodes state first
      // This will update the `nodes` array that applyNodeChanges uses in the next step
      onNodesChangeInternal(changes); 
      
      // Determine selected node based on the most up-to-date `nodes` state after changes
      // We need to use a functional update with setNodes to get the latest nodes for selection check
      setNodes(currentNodes => { // currentNodes is the state *before* applying `changes` in this render pass if onNodesChangeInternal hasn't updated it synchronously for this exact call
          const nextNodes = applyNodeChanges(changes, currentNodes); // Calculate the state *after* changes
          const newlySelectedNode = nextNodes.find(n => n.selected);
          setSelectedNode(newlySelectedNode || null);
          return nextNodes; // Return the updated nodes array
      });
    },
    [onNodesChangeInternal, setSelectedNode, setNodes] 
  );
  
  // Function to update node data, to be passed to RightSidebar via EditorPage (Step 3)
  const handleNodeDataUpdate = useCallback((nodeId: string, newData: Partial<CustomNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          // Ensure nodeTypeDefinition is preserved if it was there
          ? { ...node, data: { ...node.data, ...newData, nodeTypeDefinition: node.data.nodeTypeDefinition } } 
          : node
      )
    );
  }, [setNodes]);

  // Pass the updater function to EditorPage on mount (Step 3)
  useEffect(() => {
    if(onCanvasReady) { // Ensure onCanvasReady is provided before calling
      onCanvasReady(handleNodeDataUpdate);
    }
  }, [onCanvasReady, handleNodeDataUpdate]);

  // Standard ReactFlow handlers
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onDragOver = useCallback((event: React.DragEvent) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const definition = getNodeDefinition(type);
      if (!definition) return;
      const newNode: Node<CustomNodeData> = {
        id: uuidv4(), type, position,
        data: { ...(definition.defaultData || {}), nodeTypeDefinition: definition } // Add definition here
      };
      setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance, setNodes] 
  );

  return (
    // ReactFlowProvider is here because useReactFlow is used within this component.
    // If EditorPage also needs to useReactFlow, it should wrap FlowCanvas with ReactFlowProvider.
    // For now, FlowCanvas is the primary user.
    // This was an error in the previous reasoning. ReactFlowProvider MUST wrap components using useReactFlow.
    // So FlowCanvas cannot have its own ReactFlowProvider if EditorPage is also to use useReactFlow or manage it.
    // The prompt for EditorPage implies it will wrap FlowCanvas in ReactFlowProvider.
    // Thus, FlowCanvas should NOT have its own ReactFlowProvider if it's a child component in a larger RF context.
    // However, the FlowCanvas component uses useReactFlow, so it *must* be a child of ReactFlowProvider.
    // The example code in the prompt for EditorPage does NOT wrap FlowCanvas in ReactFlowProvider.
    // This means FlowCanvas is intended to be self-contained with its own Provider.
    <ReactFlowProvider> 
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-slate-50"
      >
        <Controls />
        <MiniMap />
        <Background gap={16} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default FlowCanvas;
