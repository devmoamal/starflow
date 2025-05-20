import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Model, ModelProvider } from '@/types'; // Assuming ModelProvider is part of Model type or defined elsewhere
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog'; // Assuming DialogFooter is needed for form submission in a dialog

// Define ModelProvider if not already defined in types
// For example:
// export type ModelProvider = 'ollama' | 'openrouter' | 'openai' | 'custom';

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(['local', 'global']),
  provider: z.enum(['ollama', 'openrouter', 'openai', 'custom']).optional(),
  modelId: z.string().min(1, { message: "Model ID is required" }),
  apiKey: z.string().optional(),
});

export type ModelFormValues = z.infer<typeof formSchema>;

interface ModelFormProps {
  onSubmit: (values: ModelFormValues) => void;
  initialData?: Partial<Model>;
  onCancel?: () => void; // Optional: for a cancel button
}

const ModelForm: React.FC<ModelFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const form = useForm<ModelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'local',
      provider: initialData?.provider || undefined,
      modelId: initialData?.modelId || '',
      apiKey: initialData?.apiKey || '',
    },
  });

  const type = form.watch('type');

  useEffect(() => {
    if (type === 'local') {
      form.setValue('provider', 'ollama'); // Default for local
      form.setValue('apiKey', ''); // Clear API key for local
    }
  }, [type, form]);

  const handleSubmit = (values: ModelFormValues) => {
    const finalValues: any = { ...values };
    if (values.type === 'local') {
      delete finalValues.apiKey; // Ensure apiKey is not sent for local models
      // Provider might still be 'ollama' or could be cleared if not relevant
    }
    if (values.type === 'global' && !values.provider) {
        form.setError("provider", {type: "manual", message: "Provider is required for global models."})
        return;
    }
    onSubmit(finalValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Custom GPT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'global' && (
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                    {/* Add other global providers as needed */}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model ID</FormLabel>
              <FormControl>
                <Input placeholder={type === 'local' ? "e.g., llama3:latest" : "e.g., gpt-4"} {...field} />
              </FormControl>
              <FormDescription>
                {type === 'local' ? "For Ollama, use the model name and tag." : "The identifier for the model from the provider."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'global' && (
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter API Key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter className="pt-4">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button type="submit">Save Model</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ModelForm;
