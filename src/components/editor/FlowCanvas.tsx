import ReactFlow, {
  Controls, Background, MiniMap, addEdge, useReactFlow,
  Node, Edge, Connection, NodeChange, EdgeChange, NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
// useFlowsStore removed as updateFlow is handled by EditorPage
import { CustomNodeData } from '@/types';
import BaseNode from '@/components/nodes/BaseNode';
import { nodeRegistry, getNodeDefinition } from '@/lib/nodeRegistry';
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback } from 'react'; // useEffect removed as it's no longer needed for flow init or autosave

const nodeTypes = nodeRegistry.reduce((acc, nodeDef) => {
  acc[nodeDef.type] = BaseNode;
  return acc;
}, {} as Record<string, React.ComponentType<NodeProps<any>>>);

interface FlowCanvasProps {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection | Edge) => void; // Added onConnect prop
  addNode: (node: Node<CustomNodeData>) => void;   // Added addNode prop
  // flow prop is no longer needed as nodes/edges are passed directly
  // setSelectedNode prop is removed as EditorPage handles it
  // onCanvasReady prop is removed
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode 
}) => {
  // reactFlowInstance is still needed for onDrop's screenToFlowPosition
  // and potentially for onDragOver if project was used (it's not currently)
  const reactFlowInstance = useReactFlow(); 
  // setNodes and setEdges are removed as they are managed by EditorPage

  // Effect for initializing nodes/edges based on flow prop is removed.
  // Debounced auto-save effect is removed.
  // Custom onNodesChange handler (for setSelectedNode) is removed.
  // handleNodeDataUpdate function is removed.
  // useEffect for onCanvasReady is removed.

  // Standard ReactFlow handlers
  // onConnect needs to inform EditorPage to update its edges state.
  // This requires a new prop or a modification to onEdgesChange.
  // For simplicity, let's assume onEdgesChange from EditorPage handles addEdge internally.
  // The `addEdge` utility is typically used with `onConnect` before calling `setEdges`.
  // So, `EditorPage`'s `onEdgesChange` should be robust enough or we need a specific `onConnect` prop.
  // Let's make onConnect call `onEdgesChange` with a specific type of change for adding an edge.
  // Or, more simply, pass an onConnect handler from EditorPage.
  // For now, the current onConnect will use the passed onEdgesChange,
  // but this means EditorPage's onEdgesChange must handle Connection objects.
  // A better approach: EditorPage provides an onConnect handler.
  
  // Let's assume EditorPage will provide a fully functional onConnect handler.
  // For now, to make this self-contained for the diff, I'll keep addEdge here,
  // but this implies onEdgesChange needs to be able to take the output of addEdge.
  // This is not standard. `onConnect` should call `setEdges(eds => addEdge(params, eds))`.
  // The `onEdgesChange` prop is for `applyEdgeChanges`.
  // So, we need an `onConnect` prop from `EditorPage`.
  // I will add `onConnect` to props.

  const onDragOver = useCallback((event: React.DragEvent) => { 
    event.preventDefault(); 
    event.dataTransfer.dropEffect = 'move'; 
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // screenToFlowPosition requires reactFlowInstance which is available via useReactFlow()
      // This hook requires FlowCanvas to be a child of ReactFlowProvider, which it is (in EditorPage).
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const definition = getNodeDefinition(type);
      if (!definition) return;

      const newNode: Node<CustomNodeData> = {
        id: uuidv4(),
        type,
        position,
        data: { ...(definition.defaultData || {}), nodeTypeDefinition: definition }
      };
      
      // To add a new node, we need to call setNodes from EditorPage.
      // This means onNodesChange must be able to handle a "add" type of change,
      // or we need a new prop like `onNodeAdd`.
      // For now, this will be a conceptual challenge. The simplest is to make onNodesChange more robust.
      // ReactFlow's onNodesChange is typically for selection, position, removal.
      // Adding a node is usually `setNodes(nds => nds.concat(newNode))`.
      // I will assume EditorPage's onNodesChange can handle a custom change object for adding.
      // This is non-standard for `applyNodeChanges`.
      // A more correct approach is to have an `addNode` function passed from EditorPage.
      // For this refactor, I will call `onNodesChange` with a custom change that EditorPage must interpret.
      // This is a temporary workaround to fit the current tool limitations.
      // A better solution would be:
      // 1. Pass `setNodes` directly (not ideal as it breaks encapsulation).
      // 2. Pass a specific `onNodeAdd` callback from `EditorPage`.
      // Let's assume `onNodesChange` in EditorPage is extended to handle this.
      // This is a known limitation of this refactoring step without adding more props.
      // For the diff, I will call onNodesChange with a "custom" add event.
      // This will likely require further adjustment in EditorPage.
      // For now, I will simulate this by creating a fake "add" change.
      // This is not how ReactFlow typically works.
      // The most straightforward way is to pass an `addNode` function as a prop.
      // Since I can't modify EditorPage in this step, I'll leave a comment.
      // For the purpose of this step, I will just call onNodesChange with a dummy change,
      // acknowledging that node addition will be broken until EditorPage is adapted or a new prop is added.
      // The `onDrop` logic should ideally call a function like `addNode(newNode)`.
      // Given the current props, this is the best I can do.
      // The prompt for EditorPage implies onNodesChange is primarily for applyNodeChanges.
      // Therefore, the `onDrop` functionality needs a separate callback from EditorPage.
      // Let's assume such a callback `onNodeCreate` exists for now for the purpose of the diff.
      // I will add `onNodeCreate: (node: Node<CustomNodeData>) => void;` to props.
      
      // Re-evaluating: The prompt for EditorPage does not mention onNodeCreate.
      // It's possible that `onDrop` logic itself is intended to move to EditorPage if it directly modifies nodes.
      // However, `screenToFlowPosition` is often a concern of the canvas.
      // Let's assume the `onNodesChange` in `EditorPage` is somehow equipped to handle additions
      // or that node addition via drag/drop is implicitly expected to be refactored/handled in EditorPage.
      // For this step, I will make `onDrop` call `onNodesChange` with the new node,
      // understanding this is not standard `NodeChange` and `EditorPage` would need custom logic.
      // This is a simplification for the current step.
      // A "proper" fix involves EditorPage providing a specific callback for node creation.
      // For this exercise, I will assume onNodesChange can receive a "add" type change.
      // This is not a standard NodeChange type.
      // onNodesChange([{ type: 'add', item: newNode } as unknown as NodeChange]); // Old way
      addNode(newNode); // Use the new addNode prop
    },
    [reactFlowInstance, addNode] // addNode is now a prop
  );
  
  // ReactFlowProvider is removed from here, as it's now in EditorPage.tsx

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange} // Directly use the prop from EditorPage
      onEdgesChange={onEdgesChange} // Directly use the prop from EditorPage
      onConnect={onConnect} // Use the onConnect prop from EditorPage
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
  );
};

export default FlowCanvas;
