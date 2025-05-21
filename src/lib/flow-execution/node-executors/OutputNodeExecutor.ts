import { Node, Edge } from 'reactflow'; // Import Edge
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';
import { useEditorStore } from '@/store/editorStore'; // Import useEditorStore

export class OutputNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices, 
    edges: Edge[], 
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const inputValue = context.getInput(node.id, 'content', edges, nodesList);

    context.addLog(`OutputNode '${node.id}' received content:`, node.id, inputValue);

    // Update the editor store with the output content for this node
    useEditorStore.getState().setExecutionOutput(node.id, inputValue);
    
    // OutputNode itself doesn't pass data to other nodes via output handles
    return {};
  }
}
