import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Flow } from '@/types'; // Adjust path if necessary
import { v4 as uuidv4 } from 'uuid';
import { ReactFlowJsonObject } from 'reactflow'; // Ensure this is correctly imported
import { LocalStorageService } from '@/lib/services/storageService'; // Import LocalStorageService

interface FlowsState {
  flows: Flow[];
  createFlow: (name: string) => Flow;
  getFlow: (id: string) => Flow | undefined;
  updateFlow: (id: string, name?: string, data?: ReactFlowJsonObject | null) => void;
  deleteFlow: (id: string) => void;
  renameFlow: (id: string, newName: string) => void;
}

export const useFlowsStore = create<FlowsState>()(
  persist(
    (set, get) => ({
      flows: [],
      createFlow: (name) => {
        const newFlow: Flow = {
          id: uuidv4(),
          name,
          data: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ flows: [...state.flows, newFlow] }));
        return newFlow;
      },
      getFlow: (id) => {
        return get().flows.find(f => f.id === id);
      },
      updateFlow: (id, name, data) => {
        set((state) => ({
          flows: state.flows.map((f) =>
            f.id === id
              ? {
                  ...f,
                  name: name ?? f.name,
                  data: data === undefined ? f.data : data, // Explicitly handle undefined for data
                  updatedAt: new Date().toISOString(),
                }
              : f
          ),
        }));
      },
      deleteFlow: (id) => {
        set((state) => ({
          flows: state.flows.filter((f) => f.id !== id),
        }));
      },
      renameFlow: (id, newName) => {
        set((state) => ({
          flows: state.flows.map((f) =>
            f.id === id ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f
          ),
        }));
      },
    }),
    {
      name: 'starflow-flows-storage',
      storage: createJSONStorage(() => new LocalStorageService()), // Use the new service
    }
  )
);
