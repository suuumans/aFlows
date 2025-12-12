'use client'

import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";


export type AnthropicFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AnthropicFormValues) => void;
    defaultValues?: Partial<AnthropicFormValues>;
}

export const AVAILABLE_MODELS = [
    "claude-3-5-sonnet-20241022",
    "claude-3-haiku-20240307",
    "claude-3-opus-20240229",
] as const;

const formSchema = z.object({
    variableName: z.string().min(1, "Variable name is required").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {message: "variable name should start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    model: z.string().min(1, "Model is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
})


export const AnthropicDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
    const form = useForm<AnthropicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
            variableName: defaultValues.variableName || "",
        },
    })

    // reset form when dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                model: defaultValues.model || AVAILABLE_MODELS[0],
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
                variableName: defaultValues.variableName || "",
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "anthropicTest";

    const handleSubmit = (data: AnthropicFormValues) => {
        onSubmit(data);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Anthropic Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Anthropic model and prompts for this node
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>

                    {/* variable name field */}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField control={form.control} name="variableName" render={({field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="anthropicTest" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Use this variable name to reference the response in other nodes: {" "} {`{{${watchVariableName}.response}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* select model field */}
                        <FormField control={form.control} name="model" render={({field}) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AVAILABLE_MODELS.map((model) => (
                                                <SelectItem key={model} value={model}>
                                                    {model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Select the model to use for the Anthropic
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {/* Anthropic system prompt field */}
                        <FormField control={form.control} name="systemPrompt" render={({field}) => (
                            <FormItem>
                                <FormLabel>System Prompt</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={'You are a helpful assistant.'} className="min-h-[80px] font-mono text-sm" {...field} />
                                </FormControl>
                                <FormDescription>
                                    System prompt sets the behavior of the Anthropic model. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify objects
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        {/* user prompt field */}
                        <FormField control={form.control} name="userPrompt" render={({field}) => (
                            <FormItem>
                                <FormLabel>User Prompt</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={'How can i improve my public speaking skills?'} className="min-h-[120px] font-mono text-sm" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The prompt to send to the AI. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify objects
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>                 
                </Form>
            </DialogContent>
        </Dialog>
    )
}
