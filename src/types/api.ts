import { Flow, Model } from './index';
import { ReactFlowJsonObject } from 'reactflow';

// --- Resource Interfaces ---

/**
 * Represents a Flow as stored and retrieved from the backend.
 */
export interface FlowResource {
  id: string;
  name: string;
  data: ReactFlowJsonObject | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // userId?: string; // Example: If flows are user-specific on the backend
}

/**
 * Represents a Model as stored and retrieved from the backend.
 * Based on the existing Model type, omitting client-specific fields like 'type' (local/global) and 'isEnabled'.
 * 'apiKey' is also omitted as it's sensitive and typically not part of a general resource.
 */
export interface ModelResource {
  id: string;
  name: string;
  provider?: 'ollama' | 'openrouter' | 'openai' | 'custom'; // Corresponds to Model.provider
  modelId: string; // Corresponds to Model.modelId (specific ID used by the provider)
  // description?: string; // Not in current Model type, but could be added
  // version?: string;     // Not in current Model type, but could be added
  // config?: Record<string, any>; // Not in current Model type, but could be added for provider-specific configs
  createdAt: string; // ISO date string - Assuming backend would add this
  updatedAt: string; // ISO date string - Assuming backend would add this
}


// --- API Interfaces for Flows ---

// List Flows
export interface ListFlowsResponse {
  flows: FlowResource[];
}

// Get Flow Details
export interface GetFlowDetailsResponse {
  flow: FlowResource;
}

// Create Flow
export interface CreateFlowRequest {
  name: string;
  data?: ReactFlowJsonObject | null;
}
export interface CreateFlowResponse {
  flow: FlowResource;
}

// Update Flow (ID typically in URL)
export interface UpdateFlowRequest {
  name?: string;
  data?: ReactFlowJsonObject | null;
}
export interface UpdateFlowResponse {
  flow: FlowResource;
}

// Delete Flow (ID typically in URL)
export interface DeleteFlowResponse {
  success: boolean;
  id: string;
}


// --- API Interfaces for Models ---

// List Models
export interface ListModelsResponse {
  models: ModelResource[];
}

// Get Model Details
export interface GetModelDetailsResponse {
  model: ModelResource;
}

// Create Model
// Based on ModelResource, but id, createdAt, updatedAt are set by backend.
export interface CreateModelRequest {
  name: string;
  provider?: 'ollama' | 'openrouter' | 'openai' | 'custom';
  modelId: string;
  // description?: string;
  // version?: string;
  // config?: Record<string, any>;
}
export interface CreateModelResponse {
  model: ModelResource;
}

// Update Model (ID typically in URL)
export interface UpdateModelRequest {
  name?: string;
  provider?: 'ollama' | 'openrouter' | 'openai' | 'custom';
  modelId?: string;
  // description?: string;
  // version?: string;
  // config?: Record<string, any>;
}
export interface UpdateModelResponse {
  model: ModelResource;
}

// Delete Model (ID typically in URL)
export interface DeleteModelResponse {
  success: boolean;
  id: string;
}

// Example for a separate action, if 'isEnabled' was managed by backend for a global model list
// For client-side 'isEnabled' as in current Model type, this might not be needed or would be different.
// Assuming 'isEnabled' is not part of ModelResource from a generic backend for now.
// If we had a specific API to manage a "global" model's availability, it might look like this:
// export interface ToggleGlobalModelAvailabilityRequest { isEnabled: boolean; }
// export interface ToggleGlobalModelAvailabilityResponse { model: ModelResource; }
