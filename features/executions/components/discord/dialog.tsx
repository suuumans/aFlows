'use client'

import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";


export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: DiscordFormValues) => void;
    defaultValues?: Partial<DiscordFormValues>;
}

const formSchema = z.object({
    variableName: z.string().min(1, "Variable name is required").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {message: "variable name should start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    username: z.string().optional(),
    webhookUrl: z.string().min(1, "Webhook URL is required"),
    content: z.string().min(1, "Message content is required").max(2000, "Discord message content exceeds the limit of 2000 characters"),
})


export const DiscordDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {

    const form = useForm<DiscordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            username: defaultValues.username || "",
            webhookUrl: defaultValues.webhookUrl || "",
            content: defaultValues.content || "",
        },
    })

    // reset form when dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                username: defaultValues.username || "",
                webhookUrl: defaultValues.webhookUrl || "",
                content: defaultValues.content || "",
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "discordTest";

    const handleSubmit = (data: DiscordFormValues) => {
        onSubmit(data);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Discord webhook and message for this node
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>

                    {/* variable name field */}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField control={form.control} name="variableName" render={({field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="discordTest" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Use this variable name to reference the response in other nodes: {" "} {`{{${watchVariableName}.response}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* select credential field */}
                        <FormField control={form.control} name="webhookUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discord Webhook URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://discord.com/api/webhooks/1234567890/1234567890" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Get the webhook URL from your Discord Channel Settings → Integration → Webhooks
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* content field */}
                        <FormField control={form.control} name="content" render={({field}) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Summary: {{variables.summary}}" className="min-h-[80px] font-mono text-sm" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The Message to send. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify objects
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        {/* username field */}
                        <FormField control={form.control} name="username" render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="DiscordBot" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Override the webhook's default username
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
