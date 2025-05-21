import { v4 as uuidv4 } from 'uuid';
import {
  // Flow types
  FlowResource,
  ListFlowsResponse,
  GetFlowDetailsResponse,
  CreateFlowRequest,
  CreateFlowResponse,
  UpdateFlowRequest,
  UpdateFlowResponse,
  DeleteFlowResponse,
  // Model types
  ModelResource,
  ListModelsResponse,
  GetModelDetailsResponse,
  CreateModelRequest,
  CreateModelResponse,
  UpdateModelRequest,
  UpdateModelResponse,
  DeleteModelResponse,
} from '@/types/api'; // Assuming types are in src/types/api.ts

export class ApiClient {
  private static instance: ApiClient;

  // Simulating a delay for API calls
  private async simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // --- Flow Methods ---

  async listFlows(): Promise<ListFlowsResponse> {
    console.log('ApiClient.listFlows called');
    await this.simulateDelay();
    // In a real API, this would fetch from localStorage or a backend
    // For now, it aligns with the synchronous stores which are the source of truth
    return Promise.resolve({ flows: [] }); 
  }

  async getFlowDetails(flowId: string): Promise<GetFlowDetailsResponse> {
    console.log(`ApiClient.getFlowDetails called for flowId: ${flowId}`);
    await this.simulateDelay();
    const mockFlow: FlowResource = {
      id: flowId,
      name: `Mock Flow ${flowId.substring(0, 4)}`,
      data: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ flow: mockFlow });
  }

  async createFlow(data: CreateFlowRequest): Promise<CreateFlowResponse> {
    console.log('ApiClient.createFlow called with data:', data);
    await this.simulateDelay();
    const newFlow: FlowResource = {
      id: uuidv4(),
      name: data.name,
      data: data.data || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ flow: newFlow });
  }

  async updateFlow(flowId: string, data: UpdateFlowRequest): Promise<UpdateFlowResponse> {
    console.log(`ApiClient.updateFlow called for flowId: ${flowId} with data:`, data);
    await this.simulateDelay();
    const updatedFlow: FlowResource = {
      id: flowId,
      name: data.name || `Updated Mock Flow ${flowId.substring(0,4)}`,
      data: data.data === undefined ? null : data.data, // Handle undefined data
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Mock older creation date
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ flow: updatedFlow });
  }

  async deleteFlow(flowId: string): Promise<DeleteFlowResponse> {
    console.log(`ApiClient.deleteFlow called for flowId: ${flowId}`);
    await this.simulateDelay();
    return Promise.resolve({ success: true, id: flowId });
  }

  // --- Model Methods ---

  async listModels(): Promise<ListModelsResponse> {
    console.log('ApiClient.listModels called');
    await this.simulateDelay();
    return Promise.resolve({ models: [] });
  }

  async getModelDetails(modelId: string): Promise<GetModelDetailsResponse> {
    console.log(`ApiClient.getModelDetails called for modelId: ${modelId}`);
    await this.simulateDelay();
    const mockModel: ModelResource = {
      id: modelId,
      name: `Mock Model ${modelId.substring(0,4)}`,
      provider: 'ollama',
      modelId: `ollama-model-${modelId.substring(0,4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ model: mockModel });
  }

  async createModel(data: CreateModelRequest): Promise<CreateModelResponse> {
    console.log('ApiClient.createModel called with data:', data);
    await this.simulateDelay();
    const newModel: ModelResource = {
      id: uuidv4(),
      name: data.name,
      provider: data.provider || 'custom',
      modelId: data.modelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ model: newModel });
  }

  async updateModel(modelId: string, data: UpdateModelRequest): Promise<UpdateModelResponse> {
    console.log(`ApiClient.updateModel called for modelId: ${modelId} with data:`, data);
    await this.simulateDelay();
    const updatedModel: ModelResource = {
      id: modelId,
      name: data.name || `Updated Model ${modelId.substring(0,4)}`,
      provider: data.provider,
      modelId: data.modelId || `updated-ollama-model-${modelId.substring(0,4)}`,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Mock older creation date
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ model: updatedModel });
  }

  async deleteModel(modelId: string): Promise<DeleteModelResponse> {
    console.log(`ApiClient.deleteModel called for modelId: ${modelId}`);
    await this.simulateDelay();
    return Promise.resolve({ success: true, id: modelId });
  }

  // --- AI Methods ---
  public async getMockedAiResponse(
    prompt: string, 
    systemPrompt?: string, 
    modelId?: string | null 
  ): Promise<{ response?: string; error?: string }> {
    await this.simulateDelay(500); // Use existing private simulateDelay
    console.log('ApiClient.getMockedAiResponse called with:', { prompt, systemPrompt, modelId });
    
    if (prompt.toLowerCase().includes("error")) {
      return { error: "This is a mock error from AI." };
    }
    
    return { 
      response: `Mock AI Response for prompt: "${prompt}" (System: ${systemPrompt || 'default'}, Model: ${modelId || 'default'})` 
    };
  }
}

// Export a singleton instance
// const apiClient = ApiClient.getInstance();
// export default apiClient;
// For now, just export the class if instantiation is handled elsewhere or if multiple instances are needed.
// The prompt implies creating the file and class, not necessarily exporting an instance.
// If a singleton is desired for immediate use, uncomment the lines above.
