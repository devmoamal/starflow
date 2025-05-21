import {
  FlowResource,
  ModelResource,
  CreateFlowRequest,
  UpdateFlowRequest,
  CreateModelRequest,
  UpdateModelRequest,
} from '@/types/api'; // Assuming types are in src/types/api.ts

/**
 * A generic interface for asynchronous CRUD operations.
 * This can be implemented by services that interact with a backend API.
 *
 * @template TResource The type of the resource being persisted (e.g., FlowResource, ModelResource).
 * @template TCreateDto The type of the DTO used for creating a new resource.
 * @template TUpdateDto The type of the DTO used for updating an existing resource.
 */
export interface AsyncPersistenceService<TResource, TCreateDto, TUpdateDto> {
  /**
   * Retrieves all resources.
   * @returns A promise that resolves to an array of resources.
   */
  getAll(): Promise<TResource[]>;

  /**
   * Retrieves a single resource by its ID.
   * @param id The ID of the resource to retrieve.
   * @returns A promise that resolves to the resource, or null if not found.
   */
  getById(id: string): Promise<TResource | null>;

  /**
   * Creates a new resource.
   * @param data The data transfer object for creating the resource.
   * @returns A promise that resolves to the newly created resource.
   */
  create(data: TCreateDto): Promise<TResource>;

  /**
   * Updates an existing resource.
   * @param id The ID of the resource to update.
   * @param data The data transfer object for updating the resource.
   * @returns A promise that resolves to the updated resource.
   */
  update(id: string, data: TUpdateDto): Promise<TResource>;

  /**
   * Deletes a resource by its ID.
   * @param id The ID of the resource to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>; // Changed to Promise<void> for delete
}

// Example usage (not part of the interface definition, just for illustration):
//
// export class FlowApiService implements AsyncPersistenceService<FlowResource, CreateFlowRequest, UpdateFlowRequest> {
//   // ... implementation using ApiClient ...
// }
//
// export class ModelApiService implements AsyncPersistenceService<ModelResource, CreateModelRequest, UpdateModelRequest> {
//   // ... implementation using ApiClient ...
// }
