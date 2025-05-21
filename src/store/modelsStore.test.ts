import { describe, it, expect, beforeEach } from 'vitest';
import { useModelsStore, ModelsState } from './modelsStore'; // Assuming ModelsState is exported for initial state
import { Model } from '@/types';

// Helper to get initial state, ensuring all necessary defaults are present
const getInitialState = (): ModelsState => ({
  models: [],
  addModel: (model) => {
    const newModel = { 
      ...model, 
      id: Math.random().toString(36).substring(2, 15), // basic id generation for test
      isEnabled: true 
    };
    useModelsStore.setState(state => ({ models: [...state.models, newModel] }));
    return newModel.id;
  },
  updateModel: (id, updates) => {
    useModelsStore.setState(state => ({
      models: state.models.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  },
  deleteModel: (id) => {
    useModelsStore.setState(state => ({
      models: state.models.filter(m => m.id !== id)
    }));
  },
  toggleModel: (id) => {
    useModelsStore.setState(state => ({
      models: state.models.map(m => m.id === id ? { ...m, isEnabled: !m.isEnabled } : m)
    }));
  },
  getModelById: (id) => {
    return useModelsStore.getState().models.find(m => m.id === id);
  },
  getEnabledModels: () => {
    return useModelsStore.getState().models.filter(m => m.isEnabled);
  }
});


describe('useModelsStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    // This captures the functions as well, ensuring clean state for actions.
    useModelsStore.setState(getInitialState(), true);
  });

  it('should add a new model', () => {
    const { addModel, getState } = useModelsStore;
    const newModelData: Omit<Model, 'id' | 'isEnabled'> = {
      name: 'Test Model',
      type: 'local',
      provider: 'ollama',
      modelId: 'test-model-ollama',
    };

    const addedModelId = addModel(newModelData);
    const models = getState().models;

    expect(models).toHaveLength(1);
    const addedModel = models[0];
    expect(addedModel.id).toBe(addedModelId);
    expect(addedModel.name).toBe('Test Model');
    expect(addedModel.isEnabled).toBe(true);
    expect(addedModel.provider).toBe('ollama');
  });

  it('should delete a model', () => {
    const { addModel, deleteModel, getState } = useModelsStore;
    const modelData: Omit<Model, 'id' | 'isEnabled'> = { name: 'To Delete', type: 'local', modelId: 'delete-me' };
    
    const modelId = addModel(modelData);
    expect(getState().models).toHaveLength(1);

    deleteModel(modelId);
    expect(getState().models).toHaveLength(0);
  });

  it('should toggle a model\'s isEnabled status', () => {
    const { addModel, toggleModel, getState } = useModelsStore;
    const modelData: Omit<Model, 'id' | 'isEnabled'> = { name: 'Toggle Me', type: 'local', modelId: 'toggle-me' };

    const modelId = addModel(modelData);
    const initialStatus = getState().models.find(m => m.id === modelId)?.isEnabled;
    expect(initialStatus).toBe(true);

    toggleModel(modelId);
    const statusAfterFirstToggle = getState().models.find(m => m.id === modelId)?.isEnabled;
    expect(statusAfterFirstToggle).toBe(false);

    toggleModel(modelId);
    const statusAfterSecondToggle = getState().models.find(m => m.id === modelId)?.isEnabled;
    expect(statusAfterSecondToggle).toBe(true);
  });

  it('should return a model by ID', () => {
    const { addModel, getModelById } = useModelsStore;
    const modelData: Omit<Model, 'id' | 'isEnabled'> = { name: 'Find Me', type: 'local', modelId: 'find-me' };
    const modelId = addModel(modelData);

    const foundModel = getModelById(modelId);
    expect(foundModel).toBeDefined();
    expect(foundModel?.id).toBe(modelId);
    expect(foundModel?.name).toBe('Find Me');

    const notFoundModel = getModelById('non-existent-id');
    expect(notFoundModel).toBeUndefined();
  });

  it('should return all enabled models', () => {
    const { addModel, toggleModel, getEnabledModels } = useModelsStore;
    const model1Data: Omit<Model, 'id' | 'isEnabled'> = { name: 'Enabled Model 1', type: 'local', modelId: 'enabled-1' };
    const model2Data: Omit<Model, 'id' | 'isEnabled'> = { name: 'Disabled Model', type: 'local', modelId: 'disabled-1' };
    const model3Data: Omit<Model, 'id' | 'isEnabled'> = { name: 'Enabled Model 2', type: 'local', modelId: 'enabled-2' };

    const model1Id = addModel(model1Data); // isEnabled: true by default
    const model2Id = addModel(model2Data); // isEnabled: true by default
    const model3Id = addModel(model3Data); // isEnabled: true by default

    toggleModel(model2Id); // Disable model2

    const enabledModels = getEnabledModels();
    expect(enabledModels).toHaveLength(2);
    expect(enabledModels.some(m => m.id === model1Id)).toBe(true);
    expect(enabledModels.some(m => m.id === model3Id)).toBe(true);
    expect(enabledModels.some(m => m.id === model2Id)).toBe(false);
  });
});
