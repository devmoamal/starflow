import React from 'react';
import { Node } from 'reactflow';
import { CustomNodeData } from '@/types'; // getNodeDefinition removed as definition is passed in data
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Button import removed as it's not used in the final code
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RightSidebarProps {
  selectedNode: Node<CustomNodeData> | null;
  onNodeDataChange: (nodeId: string, newData: Partial<CustomNodeData>) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode, onNodeDataChange }) => {
  if (!selectedNode) {
    return <div className="bg-muted/40 w-72 p-4 border-l text-sm h-full">No node selected.</div>;
  }

  const { id: nodeId, type, data } = selectedNode;
  // The full nodeTypeDefinition is now expected to be part of the node's data object.
  const definition = data.nodeTypeDefinition;

  if (!definition) {
    return <div className="bg-muted/40 w-72 p-4 border-l text-sm h-full">Error: Node definition not found in node data for {type}.</div>;
  }

  // This function updates properties that are directly part of the `data` object (like those from defaultData)
  const handleDataPropertyChange = (key: string, value: any) => {
    onNodeDataChange(nodeId, { [key]: value });
  };

  // This function updates properties that are directly part of the `data` object (like those from defaultData)
  const handleGenericDataPropertyChange = (key: string, value: any) => {
    onNodeDataChange(nodeId, { [key]: value });
  };

  const renderGenericProperties = () => {
    // Properties are defined by the keys in defaultData, but their current values are in data.
    // It's important to iterate over keys that make sense for editing.
    // For simplicity, we'll iterate over defaultData keys if they exist,
    // otherwise, all keys in data (excluding nodeTypeDefinition).
    const editableKeys = definition.defaultData ? Object.keys(definition.defaultData) : Object.keys(data).filter(k => k !== 'nodeTypeDefinition');

    return editableKeys.map((key) => {
      // Skip rendering properties handled by custom components
      if (definition.customPropertiesComponent) {
        if (type === 'variableNode' && ['name', 'value', 'valueType'].includes(key)) {
          return null;
        }
        if (type === 'aiNode' && ['prompt', 'systemPrompt', 'selectedModelId'].includes(key)) {
          return null;
        }
        if (type === 'ifStatementNode' && key === 'operator') {
          return null;
        }
        if (type === 'outputNode' && key === 'renderType') {
          return null;
        }
        if (type === 'delayNode' && key === 'delayMs') {
          return null;
        }
        if (type === 'loggerNode' && (key === 'logLevel' || key === 'logLabel')) {
          return null;
        }
        if (type === 'randomNode' && (key === 'min' || key === 'max')) {
          return null;
        }
        if (type === 'buttonNode' && key === 'buttonText') {
          return null;
        }
        // SwitchNode and MergeNode have placeholder custom editors and no defaultData keys to skip for now.
      }

      const currentValue = data[key] !== undefined ? data[key] : (definition.defaultData ? definition.defaultData[key] : '');
      let inputType = typeof currentValue === 'number' ? 'number' :
                      typeof currentValue === 'boolean' ? 'checkbox' : 'text';
      
      // Override inputType for specific known string fields that should be textareas
      if (key === 'prompt' || key === 'systemPrompt' || (typeof currentValue === 'string' && currentValue.length > 50)) {
          inputType = 'textarea';
      }
      
      // Special handling for 'valueType' in VariableNode and 'operator' in IfStatementNode
      // are removed as they are now handled by their respective customPropertiesComponent.

      if (inputType === 'checkbox') {
        return (
          <div key={key} className="mb-3 flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id={`${nodeId}-${key}`}
              checked={!!currentValue}
              onChange={(e) => handleGenericDataPropertyChange(key, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={`${nodeId}-${key}`} className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          </div>
        );
      }
      
      if (inputType === 'textarea') {
        return (
            <div key={key} className="mb-3">
              <Label htmlFor={`${nodeId}-${key}`} className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <textarea
                id={`${nodeId}-${key}`}
                value={String(currentValue)}
                onChange={(e) => handleGenericDataPropertyChange(key, e.target.value)}
                className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm p-2 min-h-[80px]"
              />
            </div>
        )
      }

      return (
        <div key={key} className="mb-3">
          <Label htmlFor={`${nodeId}-${key}`} className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <Input
            id={`${nodeId}-${key}`}
            type={inputType}
            value={String(currentValue)}
            onChange={(e) => {
              let val: string | number | boolean = e.target.value;
              if (inputType === 'number') {
                val = parseFloat(e.target.value);
                if (isNaN(val)) val = 0; // Or handle error
              }
              handleGenericDataPropertyChange(key, val);
            }}
            className="mt-1"
          />
        </div>
      );
    });
  };

  const CustomPropertiesComponent = definition.customPropertiesComponent;

  return (
    <div className="bg-muted/40 w-72 p-4 border-l text-sm space-y-4 overflow-y-auto h-full">
      <div>
        <h4 className="font-semibold text-base mb-1">{definition.label}</h4>
        {definition.description && <p className="text-xs text-muted-foreground mb-3">{definition.description}</p>}
        <p className="text-xs"><span className="font-medium">ID:</span> <span className="truncate block">{nodeId}</span></p>
        <p className="text-xs"><span className="font-medium">Type:</span> {type}</p>
      </div>
      <div className="border-t pt-3">
        <h5 className="font-semibold mb-2">Properties</h5>
        {CustomPropertiesComponent ? (
          <CustomPropertiesComponent
            nodeId={nodeId}
            data={data}
            onChange={(newData) => onNodeDataChange(nodeId, newData)}
          />
        ) : (
          renderGenericProperties()
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
