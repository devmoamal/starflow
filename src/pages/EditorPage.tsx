import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useParams, useNavigate } from 'react-router-dom';
import { useFlowsStore } from '@/store/flowsStore';
import { Flow, CustomNodeData } from '@/types'; // Ensure CustomNodeData is imported
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FlowCanvas from '@/components/editor/FlowCanvas';
import LeftSidebar from '@/components/editor/LeftSidebar';
import RightSidebar from '@/components/editor/RightSidebar';
import BottomConsole from '@/components/editor/BottomConsole';
import { Node } from 'reactflow'; // Import Node type from ReactFlow

const EditorPage: React.FC = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const navigate = useNavigate();
  const { getFlow } = useFlowsStore(); // updateFlow removed as FlowCanvas handles it
  const [currentFlow, setCurrentFlow] = useState<Flow | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [flowCanvasNodeUpdater, setFlowCanvasNodeUpdater] = 
    useState<((nodeId: string, newData: Partial<CustomNodeData>) => void) | null>(null);

  useEffect(() => {
    if (flowId) {
      const flow = getFlow(flowId);
      if (flow) {
        setCurrentFlow(flow);
        setSelectedNode(null); // Reset selected node when flow changes
        // No need to reset flowCanvasNodeUpdater here as FlowCanvas will call onCanvasReady on mount/remount
      } else {
        // toast({ title: "Error", description: "Flow not found.", variant: "destructive" });
        navigate('/flows');
      }
    }
  }, [flowId, getFlow, navigate]);

  const handleRunFlow = () => {
    console.log(`Running flow: ${currentFlow?.name}`);
    // toast({ title: "Flow Executed", description: `${currentFlow?.name} would run now.` });
  };
  
  // Memoize the onCanvasReady callback to prevent unnecessary re-renders of FlowCanvas
  const onCanvasReadyCallback = useCallback((updater: (nodeId: string, newData: Partial<CustomNodeData>) => void) => {
    setFlowCanvasNodeUpdater(() => updater);
  }, []);


  if (!currentFlow) {
    return <div className="p-4">Loading flow or flow not found...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Editor Navbar */}
      <nav className="bg-background border-b h-14 flex items-center justify-between px-4">
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate('/flows')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flows
          </Button>
        </div>
        <h1 className="text-lg font-semibold">{currentFlow.name}</h1>
        <div>
          <Button size="sm" onClick={handleRunFlow}>Run Flow</Button>
        </div>
      </nav>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <FlowCanvas
            flow={currentFlow}
            setSelectedNode={setSelectedNode}
            onCanvasReady={onCanvasReadyCallback}
          />
          <BottomConsole />
        </div>
        <RightSidebar
          selectedNode={selectedNode}
          onNodeDataChange={(nodeId, newData) => {
            if (flowCanvasNodeUpdater) {
              flowCanvasNodeUpdater(nodeId, newData);
            }
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
