import { Node, Edge } from 'reactflow'; // Edge import added
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class LoggerNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices, // services might not be used if context.addLog is preferred
    edges: Edge[], 
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const nodeData = node.data;
    const logDataValue = context.getInput(node.id, 'logData', edges, nodesList);

    const logLevel = (nodeData.logLevel as 'info' | 'warn' | 'error') || 'info';
    const logLabel = nodeData.logLabel || `Log from ${node.id}`;

    const message = `${logLabel}:`;
    
    // Log to execution context
    context.addLog(message, node.id, logDataValue);

    // Log to console
    if (console[logLevel]) {
      console[logLevel](message, logDataValue);
    } else {
      console.log(`[${logLevel.toUpperCase()}] ${message}`, logDataValue);
    }
    
    // LoggerNode has no data outputs
    return {};
  }
}
