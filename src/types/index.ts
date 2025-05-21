export interface Model {
  id: string;
  name: string;
  type: 'local' | 'global';
  provider?: 'ollama' | 'openrouter' | 'openai' | 'custom';
  modelId: string;
  apiKey?: string;
  isEnabled: boolean;
}

// ReactFlowJsonObject might need to be imported from a specific path if not at root
// e.g. import { ReactFlowJsonObject } from 'reactflow/dist/esm/types';
// For now, using 'any' as a placeholder if direct import fails.
// Consider 'any' or a more specific custom type if ReactFlowJsonObject is problematic.
import { ReactFlowJsonObject } from 'reactflow';

export interface Flow {
  id: string;
  name: string;
  data: ReactFlowJsonObject | null;
  createdAt: string;
  updatedAt: string;
}

// Node System Types
export type NodeCategory = 'Input' | 'Output' | 'Process' | 'LLM' | 'Tool' | 'Logic' | 'Custom';

export interface NodeSocket {
  name: string; // Unique identifier for the socket within the node
  type: string; // Data type, e.g., 'string', 'number', 'image', 'text', 'any'
  label: string; // User-friendly label for the socket
}

export interface NodeTypeDefinition {
  type: string; // Unique identifier for the node type, e.g., 'textInputNode', 'imageOutputNode'
  label: string; // User-friendly label for the node type, e.g., 'Text Input', 'Image Output'
  description?: string; // Brief description of what the node does
  category: NodeCategory;
  inputs: NodeSocket[];
  outputs: NodeSocket[];
  defaultData?: Record<string, any>; // Default values for any custom data fields the node might have
  icon?: React.FC<any>; // Optional icon for the node
  // Optional: custom rendering component for this specific node type if BaseNode is not sufficient
  // customComponent?: React.ComponentType<NodeProps<CustomNodeData>>;
  customPropertiesComponent?: React.FC<NodePropertiesProps<any>>; // Optional custom properties editor
}

export interface NodePropertiesProps<T> {
  nodeId: string;
  data: T;
  onChange: (newData: Partial<T>) => void;
}

// Data structure for custom nodes in ReactFlow
// This will be the 'data' prop in ReactFlow's Node object
export interface CustomNodeData {
  nodeTypeDefinition: NodeTypeDefinition; // The definition of the node
  // Plus any other custom properties specific to the node instance
  [key: string]: any; 
}

// If you are using reactflow's Node type directly, it's often aliased for clarity
// import { Node as ReactFlowNode } from 'reactflow';
// export type AppNodeType = ReactFlowNode<CustomNodeData>;
