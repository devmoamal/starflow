import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea

// Define the structure of the data for OutputNode, focusing on editable properties
interface OutputNodeData {
  renderType: string;
  mockContent: string; // Added mockContent
  // The 'content' property is an input socket, not directly edited here.
}

const OutputNodeProperties: React.FC<NodePropertiesProps<OutputNodeData>> = ({ nodeId, data, onChange }) => {
  const handleRenderTypeChange = (newRenderType: string) => {
    onChange({ renderType: newRenderType });
  };

  const handleMockContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ mockContent: event.target.value });
  };

  // Ensure data is not undefined, providing defaults if necessary
  const currentRenderType = data.renderType || 'text'; // Default to 'text' if undefined
  const currentMockContent = data.mockContent || '';

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-renderType`}>Render Type</Label>
        <Select
          value={currentRenderType}
          onValueChange={handleRenderTypeChange}
        >
          <SelectTrigger id={`${nodeId}-renderType`} className="mt-1">
            <SelectValue placeholder="Select render type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="image_url">Image URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor={`${nodeId}-mockContent`}>Mock Content (for Text/JSON)</Label>
        <Textarea
          id={`${nodeId}-mockContent`}
          value={currentMockContent}
          onChange={handleMockContentChange}
          placeholder="Enter mock content..."
          className="mt-1 min-h-[80px]"
          disabled={!(currentRenderType === 'text' || currentRenderType === 'json')}
        />
        {(currentRenderType !== 'text' && currentRenderType !== 'json') && (
          <p className="text-xs text-muted-foreground mt-1">
            Mock content is only displayed for 'Text' or 'JSON' render types.
          </p>
        )}
      </div>
    </div>
  );
};

export default OutputNodeProperties;
