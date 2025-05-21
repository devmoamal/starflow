import { Node, Edge } from 'reactflow';
import { CustomNodeData } from '@/types';
import { NodeExecutor, ExecutionContext, NodeServices } from '../types';
import { ApiClient } from '@/lib/apiClient'; // Import ApiClient

export class AiNodeExecutor implements NodeExecutor {
  async execute(
    node: Node<CustomNodeData>,
    context: ExecutionContext,
    services: NodeServices, // services might not be used directly if ApiClient is a singleton
    edges: Edge[],
    nodesList: Node<CustomNodeData>[]
  ): Promise<Record<string, any>> {
    const apiClient = ApiClient.getInstance();

    // Get prompt from input handle first, then fallback to node.data
    let promptValue = context.getInput(node.id, 'prompt', edges, nodesList);
    if (promptValue === undefined || promptValue === null || String(promptValue).trim() === '') {
      promptValue = node.data.prompt; 
    }

    // Get systemPrompt from input handle first, then fallback to node.data
    let systemPromptValue = context.getInput(node.id, 'systemPrompt', edges, nodesList);
    if (systemPromptValue === undefined || systemPromptValue === null) { // Allow empty string for systemPrompt
      systemPromptValue = node.data.systemPrompt;
    }
    
    const modelIdValue = node.data.selectedModelId as string | null | undefined;

    context.addLog(
      `AiNode '${node.id}': Executing with Prompt: "${promptValue}", System Prompt: "${systemPromptValue}", Model ID: ${modelIdValue}`,
      node.id,
      { promptValue, systemPromptValue, modelIdValue }
    );

    if (!promptValue || String(promptValue).trim() === '') {
      const errorMsg = "Prompt is required for AI Node.";
      context.addLog(`AiNode '${node.id}': Error - ${errorMsg}`, node.id, { promptValue });
      return { error: errorMsg }; // Output on the 'error' handle
    }

    try {
      const result = await apiClient.getMockedAiResponse(
        String(promptValue), // Ensure promptValue is a string
        systemPromptValue !== undefined ? String(systemPromptValue) : undefined, // Ensure systemPromptValue is string or undefined
        modelIdValue
      );

      if (result.error) {
        context.addLog(`AiNode '${node.id}': API returned an error.`, node.id, { error: result.error });
        return { error: result.error }; // Output on the 'error' handle
      }
      
      context.addLog(`AiNode '${node.id}': API returned a response.`, node.id, { response: result.response });
      return { response: result.response }; // Output on the 'response' handle

    } catch (e: any) {
      const errorMsg = `AiNode '${node.id}': Exception during API call.`;
      context.addLog(errorMsg, node.id, { error: e.message, stack: e.stack });
      return { error: e.message || "An unexpected error occurred" }; // Output on the 'error' handle
    }
  }
}
