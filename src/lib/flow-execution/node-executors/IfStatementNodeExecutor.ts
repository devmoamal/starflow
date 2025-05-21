import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class IfStatementNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices,
    edges: Edge[],
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const operandA = context.getInput(node.id, 'var1', edges, nodesList);
    const operandB = context.getInput(node.id, 'var2', edges, nodesList);
    const operator = node.data.operator as string; // Cast as string, assuming it's always present

    context.addLog(
      `IfStatementNode '${node.id}': Executing with Operand A: ${operandA}, Operand B: ${operandB}, Operator: ${operator}`,
      node.id,
      { operandA, operandB, operator }
    );

    let result = false;

    // Handle undefined inputs - for now, treat as a falsy comparison or log warning
    if (operandA === undefined || operandB === undefined) {
      context.addLog(
        `IfStatementNode '${node.id}': One or both operands are undefined. Evaluation may not be accurate.`,
        node.id,
        { operandA, operandB }
      );
      // Defaulting to false if inputs are missing for critical comparisons.
      // Specific operators like '===' or '!==' might still work as expected with undefined.
    }

    switch (operator) {
      case '===':
        result = operandA === operandB;
        break;
      case '!==':
        result = operandA !== operandB;
        break;
      case '>':
        // For simplicity, direct comparison. Add type coercion if needed.
        result = operandA > operandB;
        break;
      case '<':
        result = operandA < operandB;
        break;
      case '>=':
        result = operandA >= operandB;
        break;
      case '<=':
        result = operandA <= operandB;
        break;
      case 'contains':
        // Ensure both operands are treated as strings for these operations
        result = String(operandA).includes(String(operandB));
        break;
      case 'startsWith':
        result = String(operandA).startsWith(String(operandB));
        break;
      case 'endsWith':
        result = String(operandA).endsWith(String(operandB));
        break;
      default:
        context.addLog(
          `IfStatementNode '${node.id}': Unknown operator '${operator}'. Defaulting to false.`,
          node.id,
          { operator }
        );
        result = false;
    }

    context.addLog(`IfStatementNode '${node.id}': Condition result is ${result}.`, node.id, { result });

    if (result) {
      return { true: true }; // Output signal on the 'true' handle
    } else {
      return { false: true }; // Output signal on the 'false' handle
    }
  }
}
