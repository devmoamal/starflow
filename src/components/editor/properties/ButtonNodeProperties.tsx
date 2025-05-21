import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ButtonNodeData {
  buttonText: string;
}

const ButtonNodeProperties: React.FC<NodePropertiesProps<ButtonNodeData>> = ({ nodeId, data, onChange }) => {
  const handleButtonTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ buttonText: event.target.value });
  };

  // Ensure data is not undefined, providing a default if necessary
  const currentButtonText = data.buttonText === undefined ? 'Start Flow' : data.buttonText;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-buttonText`}>Button Text</Label>
        <Input
          id={`${nodeId}-buttonText`}
          type="text"
          value={currentButtonText}
          onChange={handleButtonTextChange}
          placeholder="Enter button text"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ButtonNodeProperties;
