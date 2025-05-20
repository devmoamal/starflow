import React from 'react';
import { nodeRegistry } from '@/lib/nodeRegistry'; // Adjust path
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Placeholders

const LeftSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-muted/40 w-64 p-4 border-r space-y-3 overflow-y-auto h-full"> {/* Added h-full and overflow-y-auto */}
      <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-muted/40 py-2 z-10">Nodes</h3> {/* Made header sticky */}
      {nodeRegistry.map((nodeDef) => (
        <Card
          key={nodeDef.type}
          className="p-2 cursor-grab shadow-sm hover:shadow-md transition-shadow bg-card" // Added bg-card
          draggable
          onDragStart={(event) => onDragStart(event, nodeDef.type)}
        >
          <CardHeader className="p-1">
            <CardTitle className="text-sm">{nodeDef.label}</CardTitle>
          </CardHeader>
          {nodeDef.description && (
            <CardDescription className="text-xs px-1 pb-1">{nodeDef.description}</CardDescription>
          )}
        </Card>
      ))}
    </div>
  );
};

export default LeftSidebar;
