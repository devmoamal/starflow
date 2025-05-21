import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RandomNodeData {
  min: number;
  max: number;
}

const RandomNodeProperties: React.FC<NodePropertiesProps<RandomNodeData>> = ({ nodeId, data, onChange }) => {
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    onChange({ min: isNaN(value) ? 0 : value });
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    onChange({ max: isNaN(value) ? 0 : value });
  };

  // Ensure data is not undefined, providing defaults if necessary
  const currentMin = data.min === undefined ? 0 : data.min;
  const currentMax = data.max === undefined ? 100 : data.max;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-min`}>Minimum Value</Label>
        <Input
          id={`${nodeId}-min`}
          type="number"
          value={String(currentMin)}
          onChange={handleMinChange}
          placeholder="Enter minimum value"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`${nodeId}-max`}>Maximum Value</Label>
        <Input
          id={`${nodeId}-max`}
          type="number"
          value={String(currentMax)}
          onChange={handleMaxChange}
          placeholder="Enter maximum value"
          className="mt-1"
        />
      </div>
       {/* Simple validation message example (can be improved) */}
       {currentMin > currentMax && (
        <p className="text-xs text-destructive mt-1">
          Minimum value should not be greater than maximum value.
        </p>
      )}
    </div>
  );
};

export default RandomNodeProperties;
