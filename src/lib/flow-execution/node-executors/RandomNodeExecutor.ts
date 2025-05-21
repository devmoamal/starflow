import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class RandomNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices,
    edges: Edge[], // Included for signature consistency, though not directly used for input data here
    nodesList: Node<CustomNodeData>[] // Included for signature consistency
  ): Promise<Record<string, any>> {
    // The 'trigger' input handle is primarily for sequencing.
    // The FlowExecutor ensures this node runs when 'trigger' is "activated".
    // We don't need to get its value here.

    const nodeData = node.data;
    let min = Number(nodeData.min);
    let max = Number(nodeData.max);

    if (isNaN(min)) {
      context.addLog(`RandomNode '${node.id}': Invalid 'min' value (${nodeData.min}). Defaulting to 0.`, node.id);
      min = 0;
    }
    if (isNaN(max)) {
      context.addLog(`RandomNode '${node.id}': Invalid 'max' value (${nodeData.max}). Defaulting to 100.`, node.id);
      max = 100;
    }
    
    if (min > max) {
      context.addLog(`RandomNode '${node.id}': 'min' value (${min}) is greater than 'max' value (${max}). Swapping them.`, node.id);
      [min, max] = [max, min]; // Swap min and max
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    context.addLog(
      `RandomNode '${node.id}': Generated random number ${randomNumber} (Min: ${min}, Max: ${max}).`,
      node.id,
      { min, max, randomNumber }
    );

    // The key 'randomNumber' must match the output handle name defined in nodeRegistry for randomNode
    return { randomNumber: randomNumber };
  }
}
