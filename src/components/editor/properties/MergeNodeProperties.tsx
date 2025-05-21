import React from 'react';
import { NodePropertiesProps } from '@/types';

// MergeNode's behavior is based on its inputs.
// It doesn't have specific internal data that needs custom editing via this panel for now.
// If in the future it had different merge strategies (e.g., array_append, object_assign),
// those could be selected here.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MergeNodeProperties: React.FC<NodePropertiesProps<any>> = ({ nodeId, data, onChange }) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Merge Node: Merges inputs directly into an array.
      </p>
      {/* Example: If it had a merge strategy property
      <div className="mt-2">
        <Label htmlFor={`${nodeId}-mergeStrategy`}>Merge Strategy</Label>
        <Select value={data.mergeStrategy || 'array_append'} onValueChange={(val) => onChange({ mergeStrategy: val })}>
          <SelectTrigger id={`${nodeId}-mergeStrategy`} className="mt-1">
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="array_append">Append to Array</SelectItem>
            <SelectItem value="object_assign">Assign to Object</SelectItem>
          </SelectContent>
        </Select>
      </div> 
      */}
    </div>
  );
};

export default MergeNodeProperties;
