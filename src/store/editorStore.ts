import { create } from 'zustand';
import {
  Node, Edge, NodeChange, EdgeChange, Connection, Viewport,
  applyNodeChanges, applyEdgeChanges, addEdge,
} from 'reactflow';
import { CustomNodeData, Flow } from '@/types/index';
import { getNodeDefinition } from '@/lib/nodeRegistry';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface EditorState {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  selectedNode: Node<CustomNodeData> | null;
  viewport: Viewport | null;
  currentFlowId: string | null;
  executionOutputs: Map<string, any>; // Added executionOutputs
}

export interface EditorActions {
  loadFlowData: (flow: Flow) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  addNode: (newNodePartial: Omit<Node<CustomNodeData>, 'id' | 'position'>, position: {x: number, y: number}) => void; // Modified to take partial and position
  updateNodeData: (nodeId: string, newData: Partial<CustomNodeData>) => void;
  deleteSelectedNode: () => void;
  setViewport: (viewport: Viewport) => void;
  deselectNode: () => void;
  cleanupStore: () => void;
  setExecutionOutput: (nodeId: string, output: any) => void; // Added setExecutionOutput
  // Internal helper or direct state manipulation for adding a complete node if needed by onDrop
  _addCompleteNode: (newNode: Node<CustomNodeData>) => void;
}

const initialState: EditorState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  viewport: null,
  currentFlowId: null,
  executionOutputs: new Map<string, any>(), // Initialize executionOutputs
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...initialState,

  loadFlowData: (flow) => {
    const initialNodes = (flow.data?.nodes || []).map(n => {
      const definition = getNodeDefinition(n.type);
      return {
        ...n,
        data: {
          ...(definition?.defaultData || {}),
          ...n.data,
          nodeTypeDefinition: definition!,
        } as CustomNodeData,
      };
    });
    set({
      nodes: initialNodes,
      edges: flow.data?.edges || [],
      viewport: flow.data?.viewport || null,
      currentFlowId: flow.id,
      selectedNode: null, // Reset selection when loading new flow
    });
    toast({
      title: "Flow Loaded",
      description: `Flow '${flow.name}' loaded into the editor.`,
    });
  },

  onNodesChange: (changes) => {
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes);
      const newlySelectedNode = nextNodes.find(n => n.selected);
      
      if (newlySelectedNode && newlySelectedNode.id !== state.selectedNode?.id) {
        const selectionChange = changes.find(c => c.type === 'select' && c.selected && c.id === newlySelectedNode.id);
        if (selectionChange) {
          toast({
            title: "Node Selected",
            description: `Selected node: '${newlySelectedNode.data.nodeTypeDefinition?.label || newlySelectedNode.type}' (ID: ${newlySelectedNode.id}).`,
          });
        }
      } else if (!newlySelectedNode && state.selectedNode) {
        // Node deselected
        const deselectionChange = changes.find(c => c.type === 'select' && !c.selected && c.id === state.selectedNode.id);
        if (deselectionChange) {
            // Optional: toast for deselection
            // toast({ title: "Node Deselected", description: `Node '${state.selectedNode.data.nodeTypeDefinition?.label}' deselected.` });
        }
      }
      return { nodes: nextNodes, selectedNode: newlySelectedNode || null };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }));
    toast({
        title: "Connection Made",
        description: "Edge connected between two nodes.",
    });
  },
  
  // This is for onDrop in FlowCanvas where position is known
  _addCompleteNode: (newNode) => {
    set((state) => ({
      nodes: state.nodes.concat(newNode),
    }));
     toast({
      title: "Node Added",
      description: `Node '${newNode.data.nodeTypeDefinition?.label || newNode.type}' added.`,
    });
  },

  // This action might be less used if onDrop directly calls _addCompleteNode
  addNode: (newNodePartial, position) => {
    const definition = getNodeDefinition(newNodePartial.type!);
    if (!definition) {
      toast({ title: "Error", description: `Node definition not found for type: ${newNodePartial.type}`, variant: "destructive" });
      return;
    }
    const newNode: Node<CustomNodeData> = {
      id: uuidv4(),
      type: newNodePartial.type!,
      position,
      data: {
        ...(definition.defaultData || {}),
        ...newNodePartial.data,
        nodeTypeDefinition: definition,
      } as CustomNodeData,
    };
    get()._addCompleteNode(newNode); // Call the internal adder
  },

  updateNodeData: (nodeId, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    }));
    // No toast here to avoid being too noisy during property editing
  },

  deleteSelectedNode: () => {
    const { selectedNode, nodes, edges } = get();
    if (!selectedNode) return;

    const deletedNodeLabel = selectedNode.data.nodeTypeDefinition?.label || selectedNode.type;
    const nodeIdToRemove = selectedNode.id;

    set({
      nodes: nodes.filter((node) => node.id !== nodeIdToRemove),
      edges: edges.filter((edge) => edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove),
      selectedNode: null,
    });

    toast({
      title: "Node Deleted",
      description: `Node '${deletedNodeLabel}' (ID: ${nodeIdToRemove}) deleted.`,
    });
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  deselectNode: () => {
    const { selectedNode } = get();
    if (selectedNode) {
         // Create a deselection change
        const deselectionChange: NodeChange = {
            type: 'select',
            id: selectedNode.id,
            selected: false,
        };
        // Apply this change through onNodesChange to ensure consistent state updates
        get().onNodesChange([deselectionChange]);
    }
    set({ selectedNode: null });
  },

  cleanupStore: () => {
    set({ 
      ...initialState, 
      executionOutputs: new Map<string, any>() // Ensure executionOutputs is reset
    }); 
    // toast({ title: "Editor Cleared", description: "Editor state has been reset."}); // Optional: can be noisy
  },

  setExecutionOutput: (nodeId, output) => {
    set((state) => ({
      executionOutputs: new Map(state.executionOutputs).set(nodeId, output),
    }));
  },
}));
