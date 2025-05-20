import React from 'react';
import { Model } from '@/types';
import { useModelsStore } from '@/store/modelsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react'; // Icon for the dropdown trigger
import { useToast } from '@/hooks/use-toast'; // Adjusted path

interface ModelCardProps {
  model: Model;
  onEdit: (model: Model) => void;
  onDelete: (modelId: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onEdit, onDelete }) => {
  const { toggleModel } = useModelsStore();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleModel(model.id);
    toast({
      title: `Model ${model.isEnabled ? 'disabled' : 'enabled'}`,
      description: `${model.name} has been ${model.isEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleTest = () => {
    console.log('Testing model ' + model.name, model);
    toast({
      title: "Testing Model",
      description: `Simulated test for ${model.name}. Check console for details.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {model.name}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(model)}>
                Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(model.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>
          ID: {model.modelId} {model.type === 'global' && `(${model.provider})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Type: <span className="font-medium text-foreground">{model.type}</span></p>
        {model.provider && <p className="text-sm text-muted-foreground">Provider: <span className="font-medium text-foreground">{model.provider}</span></p>}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" onClick={handleTest}>Test</Button>
        <div className="flex items-center space-x-2">
          <Switch
            id={`isenabled-${model.id}`}
            checked={model.isEnabled}
            onCheckedChange={handleToggle}
          />
          <label htmlFor={`isenabled-${model.id}`} className="text-sm font-medium">
            {model.isEnabled ? 'Enabled' : 'Disabled'}
          </label>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
