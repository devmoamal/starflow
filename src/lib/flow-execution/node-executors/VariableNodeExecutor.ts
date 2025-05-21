import { Node } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class VariableNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
import { Node, Edge } from 'reactflow'; // Import Edge
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class VariableNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices, // services might not be used in this simple executor
    edges: Edge[], // Corrected type to Edge[]
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const nodeData = node.data;
    let outputValue = nodeData.value; // Default to the configured value

    // Check if 'inputValue' handle is connected and has a value
    const connectedInputValue = context.getInput(node.id, 'inputValue', edges, nodesList);

    if (connectedInputValue !== undefined) {
      outputValue = connectedInputValue;
      context.addLog(`VariableNode '${node.id}' (${nodeData.name || 'Unnamed'}): Using connected input value.`, node.id, { connectedValue: outputValue });
    } else {
      context.addLog(`VariableNode '${node.id}' (${nodeData.name || 'Unnamed'}): Using configured value.`, node.id, { configuredValue: outputValue });
    }

    // Optional: Value casting/validation based on nodeData.valueType could be added here.
    // For now, we directly pass through the determined value.
    // Example:
    // if (nodeData.valueType === 'number') {
    //   outputValue = parseFloat(outputValue);
    // } else if (nodeData.valueType === 'boolean') {
    //   outputValue = String(outputValue).toLowerCase() === 'true';
    // }

    context.addLog(`VariableNode '${node.id}' outputting:`, node.id, outputValue);
    
    // The key 'value' must match the output handle name defined in nodeRegistry for variableNode
    return { value: outputValue };
  }
}
