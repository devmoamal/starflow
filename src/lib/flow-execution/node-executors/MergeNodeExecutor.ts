import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class MergeNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices,
    edges: Edge[],
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const stream1Value = context.getInput(node.id, 'stream1', edges, nodesList);
    const stream2Value = context.getInput(node.id, 'stream2', edges, nodesList);

    context.addLog(
      `MergeNode '${node.id}': Executing with Stream 1: ${JSON.stringify(stream1Value)}, Stream 2: ${JSON.stringify(stream2Value)}`,
      node.id,
      { stream1Value, stream2Value }
    );

    const mergedOutput = [stream1Value, stream2Value];
    
    context.addLog(`MergeNode '${node.id}': Outputting merged array.`, node.id, { merged: mergedOutput });

    // The key 'merged' must match the output handle name defined in nodeRegistry for mergeNode
    return { merged: mergedOutput };
  }
}
