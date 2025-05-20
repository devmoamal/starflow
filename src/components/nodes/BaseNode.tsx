import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData, NodeSocket } from '@/types'; // Adjust path
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Placeholder

const BaseNode: React.FC<NodeProps<CustomNodeData>> = ({ data, type, selected }) => {
  const { nodeTypeDefinition, ...customData } = data;

  if (!nodeTypeDefinition) {
    console.error("Node definition not found for type:", type, "Data:", data);
    return <div style={{ padding: 10, border: '1px solid red', background: 'pink'}}>Error: Node definition not found for type {type}</div>;
  }

  const { label, inputs, outputs, category } = nodeTypeDefinition;

  // Helper to render handles
  const renderHandles = (sockets: NodeSocket[], handleType: 'source' | 'target') => {
    return sockets.map((socket, index) => (
      <div key={socket.name} className="relative py-1 px-2 text-xs flex items-center justify-between">
        {handleType === 'target' && (
          <Handle
            type={handleType}
            position={Position.Left}
            id={socket.name}
            style={{ top: `${(index + 1) * 25}px`, background: '#555' }}
            isConnectable={true} // Default, can be dynamic
          />
        )}
        <span className="truncate block" title={`${socket.label} (${socket.type})`}>{socket.label} ({socket.type})</span>
        {handleType === 'source' && (
          <Handle
            type={handleType}
            position={Position.Right}
            id={socket.name}
            style={{ top: `${(index + 1) * 25}px`, background: '#555' }}
            isConnectable={true} // Default, can be dynamic
          />
        )}
      </div>
    ));
  };

  return (
    <Card className={`w-60 shadow-md ${selected ? 'ring-2 ring-primary ring-offset-1' : ''} bg-card`}>
      <CardHeader className="bg-muted/50 p-2 rounded-t-lg cursor-move">
        <CardTitle className="text-sm font-semibold truncate" title={label}>{label}</CardTitle>
        {/* <p className="text-xs text-muted-foreground">{category}</p> */}
      </CardHeader>
      <CardContent className="p-2">
        {inputs.length > 0 && (
          <div className="mb-1">
            {/* <p className="text-xs font-semibold mb-1">Inputs:</p> */}
            {renderHandles(inputs, 'target')}
          </div>
        )}
        {outputs.length > 0 && (
          <div className="mt-1">
            {/* <p className="text-xs font-semibold mb-1">Outputs:</p> */}
            {renderHandles(outputs, 'source')}
          </div>
        )}
        {/* Display custom data if any - for debugging or simple nodes */}
        {Object.entries(customData).map(([key, value]) => (
          typeof value !== 'object' && key !== 'label' && key !== 'nodeTypeDefinition' && (
             <div key={key} className="text-xs mt-1 p-1 bg-slate-100 rounded truncate" title={`${key}: ${String(value)}`}>
               <span className="font-medium">{key}</span>: {String(value)}
             </div>
          )
        ))}
      </CardContent>
    </Card>
  );
};

export default BaseNode;
