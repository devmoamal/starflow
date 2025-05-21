import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData, NodeSocket } from '@/types'; // Adjust path
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import Button
import { useEditorStore } from '@/store/editorStore'; // Import useEditorStore

const BaseNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, type, selected }) => { // Added id to props
  const { nodeTypeDefinition, ...customData } = data;
  const executionOutputs = useEditorStore((state) => state.executionOutputs); // Get executionOutputs

  if (!nodeTypeDefinition) {
    console.error("Node definition not found for type:", type, "Data:", data);
    return <div style={{ padding: 10, border: '1px solid red', background: 'pink'}}>Error: Node definition not found for type {type}</div>;
  }

  const { label, inputs, outputs, category, icon: NodeIcon } = nodeTypeDefinition; // Destructure icon as NodeIcon

  // Helper to render handles
  const renderHandles = (sockets: NodeSocket[], handleType: 'source' | 'target') => {
    return sockets.map((socket, index) => (
      <div key={socket.name} className="relative py-1 px-2 text-xs flex items-center justify-between">
        {handleType === 'target' && (
          <Handle
            type={handleType}
            position={Position.Left}
            id={socket.name}
            style={{
              top: `${index * 24 + 7}px`, // Assuming each row item is roughly 24px high
              background: '#9CA3AF',
              border: '1px solid #6B7280',
              width: '10px',
              height: '10px',
            }}
            isConnectable={true} // Default, can be dynamic
          />
        )}
        <span className="truncate block" title={`${socket.label} (${socket.type})`}>{socket.label} ({socket.type})</span>
        {handleType === 'source' && (
          <Handle
            type={handleType}
            position={Position.Right}
            id={socket.name}
            style={{
              top: `${index * 24 + 7}px`, // Assuming each row item is roughly 24px high
              background: '#9CA3AF',
              border: '1px solid #6B7280',
              width: '10px',
              height: '10px',
            }}
            isConnectable={true} // Default, can be dynamic
          />
        )}
      </div>
    ));
  };

  const categoryColorMap: Record<string, string> = {
    'Input': 'bg-sky-200',
    'Output': 'bg-emerald-200',
    'Logic': 'bg-amber-200',
    'AI': 'bg-purple-300',
    'Transform': 'bg-indigo-200',
    'Utility': 'bg-pink-200',
    'Custom': 'bg-fuchsia-200', // Added Custom category
    // Default is handled by fallback
  };

  const headerBgClass = categoryColorMap[category] || 'bg-slate-200'; // Fallback color

  return (
    <Card className={`w-60 shadow-md ${selected ? 'ring-2 ring-primary ring-offset-1' : ''} bg-card`}>
      <CardHeader className={`${headerBgClass} p-2 rounded-t-lg cursor-move flex items-center space-x-2`}>
        {NodeIcon && <NodeIcon size={16} className="flex-shrink-0" />}
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
        {Object.entries(customData).map(([key, value]) => {
          // Skip rendering certain properties handled elsewhere or not suitable for generic display
          if (key === 'label' || key === 'nodeTypeDefinition' || typeof value === 'object') {
            return null;
          }
          // Skip buttonText for buttonNode as it's rendered as a Button
          if (type === 'buttonNode' && key === 'buttonText') {
            return null;
          }
          // Skip name, value, valueType for variableNode as they are handled by specific UI
          if (type === 'variableNode' && (key === 'name' || key === 'value' || key === 'valueType')) {
            return null;
          }
          // Skip renderType and mockContent for outputNode as they are handled by specific UI or properties editor
          if (type === 'outputNode' && (key === 'renderType' || key === 'mockContent')) {
            return null;
          }
          return (
             <div key={key} className="text-xs mt-1 p-1 bg-slate-100 rounded truncate" title={`${key}: ${String(value)}`}>
               <span className="font-medium">{key}</span>: {String(value)}
             </div>
          );
        })}

        {/* Conditional rendering for variableNode */}
        {type === 'variableNode' && (
          <div className="mt-2 text-sm space-y-1">
            <div className="font-semibold truncate" title={String(customData.name)}>
              Name: {customData.name || 'N/A'}
            </div>
            <div title={String(customData.value)}>
              Value: <span className="font-mono bg-muted px-1 py-0.5 rounded">
                {customData.valueType === 'boolean' 
                  ? String(customData.value) === 'true' ? 'true' : 'false' 
                  : String(customData.value).length > 20 
                    ? `${String(customData.value).substring(0, 20)}...` 
                    : String(customData.value)
                }
                {customData.value === undefined || customData.value === null || String(customData.value).trim() === '' ? <em>(empty)</em> : null}
              </span>
            </div>
          </div>
        )}

        {/* Conditional rendering for outputNode: Display live execution output or mock content */}
        {type === 'outputNode' && (
          <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground">
              {executionOutputs.has(id) ? "Live Output:" : "Mock Output (pre-execution):"}
            </p>
            <pre className="text-xs bg-gray-100 p-1 rounded max-h-20 overflow-y-auto whitespace-pre-wrap break-all">
              {executionOutputs.has(id)
                ? (executionOutputs.get(id) !== undefined && executionOutputs.get(id) !== null ? String(executionOutputs.get(id)) : <em>(empty output)</em>)
                : (customData.renderType === 'text' || customData.renderType === 'json'
                    ? customData.mockContent || <em>(empty mock content)</em>
                    : <em>(Output for {customData.renderType} not shown here)</em>)
              }
            </pre>
          </div>
        )}

        {/* Conditional rendering for buttonNode */}
        {type === 'buttonNode' && (
          <Button
            className="w-full mt-2"
            onClick={() => console.log(`Button node '${id}' clicked. Button text: ${customData.buttonText}`)}
          >
            {customData.buttonText || 'Click Me'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BaseNode;
