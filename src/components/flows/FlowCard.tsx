import React from 'react';
import { Flow } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // For formatting dates

interface FlowCardProps {
  flow: Flow;
  onRename: (flowId: string, currentName: string) => void;
  onDelete: (flowId: string) => void;
}

const FlowCard: React.FC<FlowCardProps> = ({ flow, onRename, onDelete }) => {
  const navigate = useNavigate();

  const handleOpenFlow = () => {
    navigate(`/flows/editor/${flow.id}`);
  };

  const handleRename = () => {
    onRename(flow.id, flow.name);
  };

  const handleDelete = () => {
    onDelete(flow.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {flow.name}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleRename}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>
          Last updated: {format(new Date(flow.updatedAt), "PPpp")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created: {format(new Date(flow.createdAt), "PPpp")}
        </p>
        {/* Placeholder for more content if needed, e.g., a brief description or preview */}
      </CardContent>
      <CardFooter>
        <Button onClick={handleOpenFlow} className="w-full">Open Flow</Button>
      </CardFooter>
    </Card>
  );
};

export default FlowCard;
