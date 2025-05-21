import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Model } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from '@/lib/services/storageService'; // Import LocalStorageService

interface ModelsState {
  models: Model[];
  addModel: (model: Omit<Model, 'id' | 'isEnabled'>) => void;
  updateModel: (id: string, updates: Partial<Omit<Model, 'id'>>) => void;
  deleteModel: (id: string) => void;
  toggleModel: (id: string) => void;
  getModelById: (id: string) => Model | undefined;
}

export const useModelsStore = create<ModelsState>()(
  persist(
    (set, get) => ({
      models: [],
      addModel: (model) => {
        const newModel: Model = { ...model, id: uuidv4(), isEnabled: true };
        set((state) => ({ models: [...state.models, newModel] }));
      },
      updateModel: (id, updates) => {
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },
      deleteModel: (id) => {
        set((state) => ({
          models: state.models.filter((m) => m.id !== id),
        }));
      },
      toggleModel: (id) => {
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
          ),
        }));
      },
      getModelById: (id: string) => {
        return get().models.find(m => m.id === id);
      }
    }),
    {
      name: 'starflow-models-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => new LocalStorageService()), // Use the new service
    }
  )
);
