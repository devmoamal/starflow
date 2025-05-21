import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the structure of the data for AiNode, focusing on editable properties
interface AiNodeData {
  prompt: string;
  systemPrompt: string;
  selectedModelId: string | null;
  // mockResponse is part of the full data but not edited here
}

const AiNodeProperties: React.FC<NodePropertiesProps<AiNodeData>> = ({ nodeId, data, onChange }) => {
  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ prompt: event.target.value });
  };

  const handleSystemPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ systemPrompt: event.target.value });
  };

  const handleModelChange = (value: string) => {
    // If "null" is selected (string from SelectItem value), convert to actual null
    onChange({ selectedModelId: value === 'null' ? null : value });
  };

  // Ensure data is not undefined, providing defaults if necessary
  const currentData = {
    prompt: data.prompt || '',
    systemPrompt: data.systemPrompt || '',
    selectedModelId: data.selectedModelId === undefined ? null : data.selectedModelId,
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-prompt`}>Prompt</Label>
        <Textarea
          id={`${nodeId}-prompt`}
          value={currentData.prompt}
          onChange={handlePromptChange}
          placeholder="Enter main prompt..."
          className="mt-1 min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor={`${nodeId}-systemPrompt`}>System Prompt</Label>
        <Textarea
          id={`${nodeId}-systemPrompt`}
          value={currentData.systemPrompt}
          onChange={handleSystemPromptChange}
          placeholder="Enter system prompt (optional)..."
          className="mt-1 min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor={`${nodeId}-selectedModelId`}>Model</Label>
        <Select
          value={currentData.selectedModelId === null ? 'null' : currentData.selectedModelId}
          onValueChange={handleModelChange}
        >
          <SelectTrigger id={`${nodeId}-selectedModelId`} className="mt-1">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">None</SelectItem>
            <SelectItem value="model-a">Model A (Mock)</SelectItem>
            <SelectItem value="model-b">Model B (Mock)</SelectItem>
            {/* Add more models as needed, or fetch dynamically in a real scenario */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AiNodeProperties;
