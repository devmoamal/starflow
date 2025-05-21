import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import {
  ExecutionContext,
  ExecutionStatus,
  NodeExecutor,
  NodeServices,
} from './types';

export class FlowExecutor {
  private executors: Map<string, NodeExecutor>;
  private services: NodeServices;

  constructor(
    executors: Map<string, NodeExecutor>,
    services: NodeServices
  ) {
    this.executors = executors;
    this.services = services;
  }

  public createExecutionContext(): ExecutionContext {
    const contextData = new Map<string, any>();
    const contextLogs: { timestamp: Date; nodeId?: string; message: string; data?: any }[] = [];

    const addLog = (message: string, nodeId?: string, data?: any): void => {
      contextLogs.push({ timestamp: new Date(), nodeId, message, data });
      // console.log(`[LOG${nodeId ? ` - ${nodeId}` : ''}] ${message}`, data || '');
    };

    const setOutput = (nodeId: string, outputHandleName: string, value: any): void => {
      const key = `${nodeId}_${outputHandleName}`;
      contextData.set(key, value);
      addLog(`Output set for ${key}`, nodeId, value);
    };

    const getOutput = (nodeId: string, outputHandleName: string): any | undefined => {
      return contextData.get(`${nodeId}_${outputHandleName}`);
    };

    const getInput = (
      targetNodeId: string,
      inputHandleName: string,
      edges: Edge[],
      _nodes: Node<CustomNodeData>[] // nodes param included for signature consistency, not used in this basic version
    ): any | undefined => {
      const connectedEdge = edges.find(
        (edge) =>
          edge.target === targetNodeId && edge.targetHandle === inputHandleName
      );

      if (connectedEdge) {
        const sourceNodeId = connectedEdge.source;
        const sourceOutputHandleName = connectedEdge.sourceHandle;
        if (sourceOutputHandleName) {
          return getOutput(sourceNodeId, sourceOutputHandleName);
        } else {
          // If sourceHandle is null/undefined, it might mean the entire node output is used
          // This case needs clarification based on how nodes without specific handles are designed
          // For now, assume specific source handles are always used for data connections.
          addLog(`Input for ${targetNodeId}.${inputHandleName} has connected edge but no sourceHandle specified.`, targetNodeId);
          return undefined;
        }
      }
      addLog(`No input connection found for ${targetNodeId}.${inputHandleName}`, targetNodeId);
      return undefined;
    };

    return {
      data: contextData,
      logs: contextLogs,
      status: ExecutionStatus.IDLE,
      addLog,
      setOutput,
      getOutput,
      getInput,
    };
  }

  public async run(
    nodes: Node<CustomNodeData>[],
    edges: Edge[],
    startNodeId?: string
  ): Promise<ExecutionContext> {
    const context = this.createExecutionContext();
    context.status = ExecutionStatus.RUNNING;
    context.addLog('Flow execution started.');

    const executionQueue: string[] = [];
    const processedNodes = new Set<string>(); // To avoid re-processing nodes in simple linear flows or simple branches

    if (startNodeId) {
      const startNode = nodes.find(n => n.id === startNodeId);
      if (startNode) {
        executionQueue.push(startNode.id);
        context.addLog(`Starting execution with node: ${startNode.id} (${startNode.data.nodeTypeDefinition?.label || startNode.type})`);
      } else {
        context.addLog(`Error: Provided startNodeId '${startNodeId}' not found in nodes list.`, undefined, { nodes });
        context.status = ExecutionStatus.FAILED;
        return context;
      }
    } else {
      // For now, require a startNodeId. More complex start logic (e.g., nodes with no inputs) can be added later.
      context.addLog('Error: Flow execution requires a startNodeId.', undefined, { nodes, edges });
      context.status = ExecutionStatus.FAILED;
      return context;
    }
    
    try {
      while (executionQueue.length > 0) {
        const currentNodeId = executionQueue.shift()!; // Non-null assertion as we check length

        if (processedNodes.has(currentNodeId)) {
          context.addLog(`Node ${currentNodeId} already processed, skipping. (Cycle or multiple paths to node)`, currentNodeId);
          continue; 
        }

        const currentNode = nodes.find((n) => n.id === currentNodeId);
        if (!currentNode) {
          context.addLog(`Error: Node with ID ${currentNodeId} not found in graph.`, undefined, { currentNodeId });
          throw new Error(`Node ${currentNodeId} not found.`);
        }
        
        context.addLog(`Executing node: ${currentNode.id} (${currentNode.data.nodeTypeDefinition?.label || currentNode.type})`, currentNode.id);
        const executor = this.executors.get(currentNode.type!); // node.type should always be defined

        if (!executor) {
          context.addLog(`Error: No executor found for node type: ${currentNode.type}`, currentNode.id);
          throw new Error(`No executor for node type ${currentNode.type}`);
        }

        const outputValues = await executor.execute(
          currentNode,
          context,
          this.services,
          edges,
          nodes
        );
        
        processedNodes.add(currentNodeId);
        context.addLog(`Node ${currentNode.id} executed. Outputs:`, currentNode.id, outputValues);

        // Store outputs and find next nodes
        for (const [outputHandleName, value] of Object.entries(outputValues)) {
          context.setOutput(currentNode.id, outputHandleName, value);

          edges.forEach((edge) => {
            if (edge.source === currentNode.id && edge.sourceHandle === outputHandleName) {
              const nextNodeId = edge.target;
              if (!processedNodes.has(nextNodeId) && !executionQueue.includes(nextNodeId)) {
                 // Basic check: add to queue. A more robust system would check if all inputs for nextNodeId are ready.
                 // For now, NodeExecutor's `execute` method is responsible for checking if its inputs are available via context.getInput().
                context.addLog(`Queueing next node ${nextNodeId} from ${currentNode.id}.${outputHandleName}`, currentNode.id);
                executionQueue.push(nextNodeId);
              }
            }
          });
        }
      }
      context.status = ExecutionStatus.COMPLETED;
      context.addLog('Flow execution completed successfully.');
    } catch (error: any) {
      context.status = ExecutionStatus.FAILED;
      context.addLog(`Error during flow execution: ${error.message}`, undefined, { error });
      if (error.stack) {
        context.addLog(`Error Stack: ${error.stack}`, undefined);
      }
    }

    return context;
  }
}
