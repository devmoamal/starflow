import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class SwitchNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices,
    edges: Edge[],
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const dataIn = context.getInput(node.id, 'dataIn', edges, nodesList);
    const status = context.getInput(node.id, 'status', edges, nodesList);

    context.addLog(
      `SwitchNode '${node.id}': Executing with dataIn: ${JSON.stringify(dataIn)}, status: ${status}`,
      node.id,
      { dataIn, status }
    );

    // Consider boolean true, string "true", number 1 as true for status
    const isStatusTrue = status === true || String(status).toLowerCase() === 'true' || Number(status) === 1;

    if (isStatusTrue) {
      context.addLog(`SwitchNode '${node.id}': Status is TRUE. Passing dataOut.`, node.id, { dataOut: dataIn });
      return { dataOut: dataIn }; // Output data on the 'dataOut' handle
    } else {
      context.addLog(`SwitchNode '${node.id}': Status is FALSE. Not passing dataOut.`, node.id);
      return {}; // No output from 'dataOut'
    }
  }
}
