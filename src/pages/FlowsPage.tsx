import React, { useState } from 'react';
import { useFlowsStore } from '@/store/flowsStore';
import FlowCard from '@/components/flows/FlowCard';
import PageWrapper from '@/components/common/PageWrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const FlowsPage: React.FC = () => {
  const { flows, createFlow, renameFlow, deleteFlow } = useFlowsStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renamingFlowId, setRenamingFlowId] = useState<string | null>(null);
  const [currentFlowName, setCurrentFlowName] = useState(''); // For display in rename dialog
  const [updatedFlowName, setUpdatedFlowName] = useState('');


  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [flowToDeleteId, setFlowToDeleteId] = useState<string | null>(null);

  const handleCreateFlow = () => {
    if (!newFlowName.trim()) {
      toast({
        title: 'Error',
        description: 'Flow name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    const newFlow = createFlow(newFlowName);
    setNewFlowName('');
    setIsCreateDialogOpen(false);
    toast({
      title: 'Flow Created',
      description: `Flow "${newFlow.name}" has been successfully created.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate(`/flows/editor/${newFlow.id}`)}>
          Open Flow
        </Button>
      ),
    });
    // Optionally navigate to the editor: navigate(`/flows/editor/${newFlow.id}`);
  };

  const handleRenameInitiate = (flowId: string, currentName: string) => {
    setRenamingFlowId(flowId);
    setCurrentFlowName(currentName);
    setUpdatedFlowName(currentName); // Initialize with current name
    setIsRenameDialogOpen(true);
  };

  const handleRenameFlow = () => {
    if (!renamingFlowId || !updatedFlowName.trim()) {
      toast({
        title: 'Error',
        description: 'Flow name cannot be empty for renaming.',
        variant: 'destructive',
      });
      return;
    }
    renameFlow(renamingFlowId, updatedFlowName);
    toast({ title: 'Flow Renamed', description: `Flow has been successfully renamed to "${updatedFlowName}".` });
    setIsRenameDialogOpen(false);
    setRenamingFlowId(null);
    setUpdatedFlowName('');
  };

  const handleDeleteInitiate = (flowId: string) => {
    setFlowToDeleteId(flowId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (flowToDeleteId) {
      const flow = flows.find(f => f.id === flowToDeleteId);
      deleteFlow(flowToDeleteId);
      toast({
        title: 'Flow Deleted',
        description: `Flow "${flow?.name || 'The flow'}" has been deleted.`,
        variant: 'destructive',
      });
      setFlowToDeleteId(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };


  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Flows</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setNewFlowName(''); setIsCreateDialogOpen(true);}}>Create Flow</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Flow</DialogTitle>
              <DialogDescription>
                Enter a name for your new flow. Click create when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flow-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="flow-name"
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleCreateFlow}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {flows.length === 0 ? (
        <p>No flows created yet. Click "Create Flow" to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <FlowCard
              key={flow.id}
              flow={flow}
              onRename={handleRenameInitiate}
              onDelete={handleDeleteInitiate}
            />
          ))}
        </div>
      )}

      {/* Rename Flow Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Flow</DialogTitle>
            <DialogDescription>
              Current name: "{currentFlowName}". Enter the new name for your flow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rename-flow-name" className="text-right">
                New Name
              </Label>
              <Input
                id="rename-flow-name"
                value={updatedFlowName}
                onChange={(e) => setUpdatedFlowName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleRenameFlow}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the flow.
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

export default FlowsPage;
