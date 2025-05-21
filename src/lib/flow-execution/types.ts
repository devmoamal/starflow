import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types'; // Assuming CustomNodeData is in src/types/index.ts

export enum ExecutionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING_INPUT = 'PENDING_INPUT', // For nodes waiting on data
}

export interface ExecutionContext {
  // Stores output values from executed nodes, keyed by `${nodeId}_${outputHandleName}` or similar
  data: Map<string, any>;
  // Stores logs generated during execution
  logs: { timestamp: Date; nodeId?: string; message: string; data?: any }[];
  // Overall status of the flow execution
  status: ExecutionStatus;
  // Optional: keep track of which nodes are currently executing or pending
  // nodeStates?: Map<string, ExecutionStatus>;

  addLog: (message: string, nodeId?: string, data?: any) => void;
  setOutput: (nodeId: string, outputHandleName: string, value: any) => void;
  getOutput: (nodeId: string, outputHandleName: string) => any | undefined;
  /**
   * Helper to get data for a specific input handle of a node.
   * It finds the connected output handle from a source node and retrieves its value from the context's data map.
   * @param targetNodeId The ID of the node for which the input is being fetched.
   * @param inputHandleName The name/ID of the input handle on the target node.
   * @param edges All edges in the flow.
   * @param nodes All nodes in the flow (not directly used by this basic version but good for context).
   * @returns The value from the connected output handle, or undefined if not connected or source not executed.
   */
  getInput: (targetNodeId: string, inputHandleName: string, edges: Edge[], nodes: Node<CustomNodeData>[]) => any | undefined;
}

// Placeholder for services that nodes might need during execution
// Example:
// import { ApiClient } from '@/lib/apiClient';
export interface NodeServices {
  // apiClient?: ApiClient; // Example for future use
  // Add other services nodes might need
  logMessage: (message: string, nodeId?: string) => void; // Simple logging service, can be tied to ExecutionContext's addLog
}

export interface NodeExecutor {
  /**
   * Executes the node's logic.
   * @param node The current node object from ReactFlow.
   * @param context The current execution context (to get inputs, set outputs, log).
   * @param services Shared services available to nodes.
   * @param edges All edges in the flow, for context if needed by the executor (e.g. to find connected nodes).
   * @param nodesList All nodes in the flow, for context if needed.
   * @returns A promise that resolves to a map of output handle names to their values.
   *          If the node is purely a signal or has no data output, it can resolve to an empty object or a specific signal object.
   *          If an error occurs, the promise should be rejected.
   */
  execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices,
    edges: Edge[],
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>>;
}
