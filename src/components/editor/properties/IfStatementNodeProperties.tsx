import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the structure of the data for IfStatementNode, focusing on editable properties
interface IfStatementNodeData {
  operator: string;
  // Other properties like var1, var2 are handled by connections, not direct data editing here.
}

const IfStatementNodeProperties: React.FC<NodePropertiesProps<IfStatementNodeData>> = ({ nodeId, data, onChange }) => {
  const handleOperatorChange = (newOperator: string) => {
    onChange({ operator: newOperator });
  };

  // Ensure data is not undefined, providing a default if necessary
  const currentOperator = data.operator || '==='; // Default to '===' if undefined

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-operator`}>Operator</Label>
        <Select
          value={currentOperator}
          onValueChange={handleOperatorChange}
        >
          <SelectTrigger id={`${nodeId}-operator`} className="mt-1">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="===">=== (Equals)</SelectItem>
            <SelectItem value="!==">!== (Not Equals)</SelectItem>
            <SelectItem value=">">&gt; (Greater Than)</SelectItem>
            <SelectItem value="<">&lt; (Less Than)</SelectItem>
            <SelectItem value=">=">&gt;= (Greater or Equal)</SelectItem>
            <SelectItem value="<=">&lt;= (Less or Equal)</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="startsWith">Starts With</SelectItem>
            <SelectItem value="endsWith">Ends With</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IfStatementNodeProperties;
