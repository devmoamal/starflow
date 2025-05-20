import React, { useState } from 'react';
import { useModelsStore } from '@/store/modelsStore';
import ModelCard from '@/components/models/ModelCard';
import ModelForm, { ModelFormValues } from '@/components/models/ModelForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from '@/components/ui/dialog';
import PageWrapper from '@/components/common/PageWrapper';
import { useToast } from '@/hooks/use-toast'; // Adjusted path
import { Model } from '@/types';

const ModelsPage: React.FC = () => {
  const { models, addModel, updateModel, deleteModel } = useModelsStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | undefined>(undefined);

  // States for confirmation dialog
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [modelToDeleteId, setModelToDeleteId] = useState<string | null>(null);


  const handleFormSubmit = (values: ModelFormValues) => {
    if (editingModel) {
      updateModel(editingModel.id, values);
      toast({ title: 'Model Updated', description: `${values.name} has been updated.` });
    } else {
      addModel(values);
      toast({ title: 'Model Added', description: `${values.name} has been added.` });
    }
    setEditingModel(undefined);
    setIsDialogOpen(false);
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setIsDialogOpen(true);
  };

  const handleDeleteInitiate = (modelId: string) => {
    setModelToDeleteId(modelId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (modelToDeleteId) {
      const model = models.find(m => m.id === modelToDeleteId);
      deleteModel(modelToDeleteId);
      toast({ title: 'Model Deleted', description: `${model?.name || 'The model'} has been deleted.`, variant: 'destructive' });
      setModelToDeleteId(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };


  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Models</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingModel(undefined);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingModel(undefined); setIsDialogOpen(true); }}>Add Model</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingModel ? 'Edit Model' : 'Add New Model'}</DialogTitle>
              <DialogDescription>
                {editingModel ? 'Update the details of your existing model.' : 'Fill in the form to add a new AI model.'}
              </DialogDescription>
            </DialogHeader>
            <ModelForm
              onSubmit={handleFormSubmit}
              initialData={editingModel}
              onCancel={() => { setEditingModel(undefined); setIsDialogOpen(false);}}
            />
          </DialogContent>
        </Dialog>
      </div>

      {models.length === 0 ? (
        <p>No models configured yet. Click "Add Model" to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onEdit={handleEdit}
              onDelete={handleDeleteInitiate}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the model.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default ModelsPage;
