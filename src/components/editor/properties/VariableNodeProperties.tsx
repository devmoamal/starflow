import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VariableNodeData {
  name: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean';
}

const VariableNodeProperties: React.FC<NodePropertiesProps<VariableNodeData>> = ({ nodeId, data, onChange }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: event.target.value });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: any = event.target.value;
    if (data.valueType === 'number') {
      newValue = parseFloat(event.target.value);
      if (isNaN(newValue)) {
        newValue = 0; // Or some other default/error handling
      }
    } else if (data.valueType === 'boolean') {
      // For boolean, a checkbox or toggle would be better, but using text input for now.
      // Consider 'true', 'false', '1', '0' or a toggle.
      // This basic implementation assumes text input for boolean might not be ideal.
      // A checkbox or a select with "true"/"false" would be more user-friendly.
      // For now, let's treat it as string and let the backend handle conversion if necessary.
      // Or, if we want to be strict with a text input:
      // newValue = event.target.value.toLowerCase() === 'true';
    }
    onChange({ value: newValue });
  };

  const handleValueTypeChange = (newType: 'string' | 'number' | 'boolean') => {
    // When type changes, we might want to convert the existing value or reset it.
    // For simplicity, let's reset value or try to convert.
    let resetValue: any = data.value;
    if (newType === 'number') {
      resetValue = parseFloat(String(data.value));
      if (isNaN(resetValue)) resetValue = 0;
    } else if (newType === 'boolean') {
      // For boolean, it's tricky with arbitrary previous values.
      // Defaulting to false or trying a 'truthy'/'falsy' conversion.
      resetValue = String(data.value).toLowerCase() === 'true' || String(data.value) === '1';
    } else { // string
      resetValue = String(data.value);
    }
    onChange({ valueType: newType, value: resetValue });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-name`}>Name</Label>
        <Input
          id={`${nodeId}-name`}
          type="text"
          value={data.name || ''}
          onChange={handleNameChange}
          placeholder="Variable Name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor={`${nodeId}-valueType`}>Value Type</Label>
        <Select value={data.valueType} onValueChange={handleValueTypeChange}>
          <SelectTrigger id={`${nodeId}-valueType`} className="mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor={`${nodeId}-value`}>Value</Label>
        {data.valueType === 'boolean' ? (
          <Select
            value={String(data.value)}
            onValueChange={(val) => onChange({ value: val === 'true' })}
          >
            <SelectTrigger id={`${nodeId}-value`} className="mt-1">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={`${nodeId}-value`}
            type={data.valueType === 'number' ? 'number' : 'text'}
            value={data.value === undefined ? '' : String(data.value)}
            onChange={handleValueChange}
            placeholder="Variable Value"
            className="mt-1"
          />
        )}
      </div>
    </div>
  );
};

export default VariableNodeProperties;
