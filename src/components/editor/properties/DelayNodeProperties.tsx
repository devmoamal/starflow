import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DelayNodeData {
  delayMs: number;
}

const DelayNodeProperties: React.FC<NodePropertiesProps<DelayNodeData>> = ({ nodeId, data, onChange }) => {
  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    onChange({ delayMs: isNaN(value) ? 0 : value });
  };

  // Ensure data is not undefined, providing a default if necessary
  const currentDelayMs = data.delayMs === undefined ? 1000 : data.delayMs;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-delayMs`}>Delay (milliseconds)</Label>
        <Input
          id={`${nodeId}-delayMs`}
          type="number"
          value={String(currentDelayMs)} // Input type number still takes string value
          onChange={handleDelayChange}
          placeholder="Enter delay in ms"
          className="mt-1"
          min="0" // Optional: prevent negative numbers
        />
      </div>
    </div>
  );
};

export default DelayNodeProperties;
