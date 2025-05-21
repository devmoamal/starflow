import React from 'react';
import { NodePropertiesProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LogLevel = 'info' | 'warn' | 'error';

interface LoggerNodeData {
  logLevel: LogLevel;
  logLabel: string;
}

const LoggerNodeProperties: React.FC<NodePropertiesProps<LoggerNodeData>> = ({ nodeId, data, onChange }) => {
  const handleLogLevelChange = (newLevel: LogLevel) => {
    onChange({ logLevel: newLevel });
  };

  const handleLogLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ logLabel: event.target.value });
  };

  // Ensure data is not undefined, providing defaults if necessary
  const currentLogLevel = data.logLevel || 'info';
  const currentLogLabel = data.logLabel === undefined ? 'Log' : data.logLabel;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${nodeId}-logLevel`}>Log Level</Label>
        <Select value={currentLogLevel} onValueChange={handleLogLevelChange}>
          <SelectTrigger id={`${nodeId}-logLevel`} className="mt-1">
            <SelectValue placeholder="Select log level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor={`${nodeId}-logLabel`}>Log Label</Label>
        <Input
          id={`${nodeId}-logLabel`}
          type="text"
          value={currentLogLabel}
          onChange={handleLogLabelChange}
          placeholder="Enter log label"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default LoggerNodeProperties;
