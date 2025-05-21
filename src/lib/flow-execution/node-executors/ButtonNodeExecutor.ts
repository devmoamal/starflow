import { Node, Edge } from 'reactflow'; // Import Edge
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';

export class ButtonNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices, // services might not be used in this simple executor
    edges: Edge[], 
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const nodeData = node.data;
    const buttonText = nodeData.buttonText || 'Unnamed Button';

    // For a real execution, this node might be triggered by a UI interaction.
    // In a non-interactive test run, or if it's the startNodeId, it "triggers" immediately.
    // If this node is a startNodeId, its execution means the button "press" has occurred.
    // If it's part of a flow and has an input signal handle, it would wait for that signal.
    // For now, assuming its execution means it has been triggered.
    
    context.addLog(`ButtonNode '${node.id}' (${buttonText}) triggered.`, node.id);

    // The key 'trigger' must match the output handle name defined in nodeRegistry for buttonNode
    return { trigger: true }; // Outputting a signal
  }
}
