import React from 'react';
import { NodePropertiesProps } from '@/types';

// SwitchNode's behavior is primarily controlled by its 'status' input.
// It doesn't have specific internal data that needs custom editing via this panel for now.
// If in the future it had, for example, a default state if no status is connected,
// that could be edited here.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SwitchNodeProperties: React.FC<NodePropertiesProps<any>> = ({ nodeId, data, onChange }) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Switch Node: Status is controlled by the 'status' input handle.
      </p>
      {/* Example: If it had a default state property 'defaultOn'
      <div className="mt-2">
        <Label htmlFor={`${nodeId}-defaultOn`}>Default to ON if no status input</Label>
        <Switch id={`${nodeId}-defaultOn`} checked={data.defaultOn} onCheckedChange={(val) => onChange({ defaultOn: val })} />
      </div> 
      */}
    </div>
  );
};

export default SwitchNodeProperties;
