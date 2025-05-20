import { NodeTypeDefinition } from '@/types'; // Adjust path if necessary
// import { Variable, Brain, GitCompareArrows, ToggleRight } from 'lucide-react'; // Example icons

export const nodeRegistry: NodeTypeDefinition[] = [
  // 1. Variable Node
  {
    type: 'variableNode',
    label: 'Variable',
    description: 'Stores and outputs a configurable value.',
    category: 'Input',
    // icon: Variable,
    inputs: [
      { name: 'inputValue', type: 'any', label: 'Set Value' },
    ],
    outputs: [
      { name: 'value', type: 'any', label: 'Value' },
    ],
    defaultData: {
      name: 'myVariable', // Name of the variable (for display or reference)
      value: '',        // Actual value (string, number, boolean)
      valueType: 'string', // 'string', 'number', 'boolean' (for Right Sidebar editor)
    },
    // customPropertiesComponent: VariableNodeProperties (to be created later)
  },

  // 2. If Statement Node
  {
    type: 'ifStatementNode',
    label: 'If Statement',
    description: 'Compares two inputs and triggers true/false output.',
    category: 'Logic',
    // icon: GitCompareArrows,
    inputs: [
      { name: 'var1', type: 'any', label: 'Operand A' },
      { name: 'var2', type: 'any', label: 'Operand B' },
    ],
    outputs: [
      { name: 'true', type: 'signal', label: 'True' }, // 'signal' type indicates execution flow
      { name: 'false', type: 'signal', label: 'False' },
    ],
    defaultData: {
      operator: '===', // e.g., '===', '!=', '>', '<', '>=', '<=', 'contains', 'startsWith', 'endsWith'
      // We'll need a way to edit this operator in the Right Sidebar
    },
    // customPropertiesComponent: IfStatementNodeProperties (to be created later)
  },

  // 3. AI Node
  {
    type: 'aiNode',
    label: 'AI Task',
    description: 'Performs an AI task with a given prompt.',
    category: 'AI', // Corrected category
    // icon: Brain,
    inputs: [
      { name: 'prompt', type: 'string', label: 'Prompt' },
      { name: 'systemPrompt', type: 'string', label: 'System Prompt (Optional)' },
      // Later: { name: 'model', type: 'string', label: 'Model ID (Optional)' }
    ],
    outputs: [
      { name: 'response', type: 'string', label: 'Response' },
      { name: 'error', type: 'string', label: 'Error (Optional)' },
    ],
    defaultData: {
      prompt: 'Translate the following text to French: {{input.prompt}}', // Example using a template
      systemPrompt: 'You are a helpful AI assistant.',
      selectedModelId: null, // To be linked with Models store later
      // Mock response for now, actual logic will be in workflow execution
      mockResponse: 'This is a mock AI response.',
    },
    // customPropertiesComponent: AiNodeProperties (to be created later)
  },

  // 4. Switch Node
  {
    type: 'switchNode',
    label: 'Switch',
    description: 'Passes data through only if its status is "on".',
    category: 'Logic',
    // icon: ToggleRight,
    inputs: [
      { name: 'dataIn', type: 'any', label: 'Input Data' },
      { name: 'status', type: 'boolean', label: 'Status (On/Off)' }, // true for on, false for off
    ],
    outputs: [
      { name: 'dataOut', type: 'any', label: 'Output Data' },
    ],
    defaultData: {
      // The switch's behavior is primarily controlled by the 'status' input.
      // No specific internal data needed for its core logic for now.
    },
    // customPropertiesComponent: SwitchNodeProperties (to be created later)
  },

  // 5. Button Node
  {
    type: 'buttonNode',
    label: 'Button',
    description: 'Triggers the flow when clicked.',
    category: 'Input',
    // icon: Button,
    inputs: [], // No standard data inputs, it's a manual trigger
    outputs: [
      { name: 'trigger', type: 'signal', label: 'Trigger' },
    ],
    defaultData: {
      buttonText: 'Start Flow',
    },
    // customPropertiesComponent: ButtonNodeProperties (to be created later)
  },

  // 6. Delay Node
  {
    type: 'delayNode',
    label: 'Delay',
    description: 'Adds a specified delay before passing a signal.',
    category: 'Utility', // Changed to Utility based on common practice
    // icon: Timer,
    inputs: [
      { name: 'signalIn', type: 'signal', label: 'Start Delay' },
    ],
    outputs: [
      { name: 'signalOut', type: 'signal', label: 'After Delay' },
    ],
    defaultData: {
      delayMs: 1000, // Default delay of 1 second
    },
    // customPropertiesComponent: DelayNodeProperties (to be created later)
  },

  // 7. Merge Node
  {
    type: 'mergeNode',
    label: 'Merge',
    description: 'Merges two data streams into one.',
    category: 'Transform', // Changed to Transform based on common practice
    // icon: Combine,
    inputs: [
      { name: 'stream1', type: 'any', label: 'Stream 1' },
      { name: 'stream2', type: 'any', label: 'Stream 2' },
    ],
    outputs: [
      { name: 'merged', type: 'any', label: 'Merged Data' },
    ],
    defaultData: {
      // mergeStrategy: 'array_append' // Future: 'object_assign', etc.
    },
    // customPropertiesComponent: MergeNodeProperties (to be created later)
  },

  // 8. Logger Node
  {
    type: 'loggerNode',
    label: 'Logger',
    description: 'Logs incoming data to the console.',
    category: 'Output',
    // icon: FileText,
    inputs: [
      { name: 'logData', type: 'any', label: 'Data to Log' },
    ],
    outputs: [], // No data output, visual/debug only
    defaultData: {
      logLevel: 'info', // 'info', 'warn', 'error'
      logLabel: 'Log', // Custom label for the log message
    },
    // customPropertiesComponent: LoggerNodeProperties (to be created later)
  },

  // 9. Random Node
  {
    type: 'randomNode',
    label: 'Random Number',
    description: 'Outputs a random number within a specified range.',
    category: 'Input', // Can act as an input or be triggered
    // icon: Shuffle,
    inputs: [ // Optional trigger to re-generate
      { name: 'trigger', type: 'signal', label: 'Regenerate (Optional)'}
    ],
    outputs: [
      { name: 'randomNumber', type: 'number', label: 'Number' },
    ],
    defaultData: {
      min: 0,
      max: 100,
    },
    // customPropertiesComponent: RandomNodeProperties (to be created later)
  },

  // 10. Output Node
  {
    type: 'outputNode',
    label: 'Output Display',
    description: 'Renders incoming content (HTML, Markdown, Image, Text).',
    category: 'Output',
    // icon: MonitorPlay,
    inputs: [
      { name: 'content', type: 'any', label: 'Content' },
    ],
    outputs: [], // No data output, renders content
    defaultData: {
      renderType: 'text', // 'html', 'markdown', 'image_url', 'text', 'json'
      // Content is received via input, no default content needed here usually
    },
    // customPropertiesComponent: OutputNodeProperties (to be created later)
  }
];

export const getNodeDefinition = (type: string): NodeTypeDefinition | undefined => {
  return nodeRegistry.find(node => node.type === type);
};
