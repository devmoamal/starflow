import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class DelayNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices,
    edges: Edge[], // Included for signature consistency, though not directly used for input data here
    nodesList: Node<CustomNodeData>[] // Included for signature consistency
  ): Promise<Record<string, any>> {
    // The 'signalIn' input handle primarily acts as a trigger for this node's execution.
    // The FlowExecutor ensures this node runs when 'signalIn' is "activated".
    // We don't need to explicitly get its value unless it carries data to be delayed,
    // which is not the current design of DelayNode.

    const delayMs = Number(node.data.delayMs) || 1000; // Default to 1000ms if not specified or invalid

    context.addLog(
      `DelayNode '${node.id}': Starting delay of ${delayMs}ms.`,
      node.id,
      { delayMs }
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        context.addLog(
          `DelayNode '${node.id}': Delay finished after ${delayMs}ms. Outputting signal.`,
          node.id
        );
        // The key 'signalOut' must match the output handle name defined in nodeRegistry for delayNode
        resolve({ signalOut: true }); // Outputting a signal
      }, delayMs);
    });
  }
}
