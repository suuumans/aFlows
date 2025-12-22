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


export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: SlackFormValues) => void;
    defaultValues?: Partial<SlackFormValues>;
}

const formSchema = z.object({
    variableName: z.string().min(1, "Variable name is required").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {message: "variable name should start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    webhookUrl: z.string().min(1, "Webhook URL is required"),
    content: z.string().min(1, "Content is required"),
})


export const SlackDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {

    const form = useForm<SlackFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            webhookUrl: defaultValues.webhookUrl || "",
            content: defaultValues.content || "",
            variableName: defaultValues.variableName || "",
        },
    })

    // reset form when dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                webhookUrl: defaultValues.webhookUrl || "",
                content: defaultValues.content || "",
                variableName: defaultValues.variableName || "",
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "slackTest";

    const handleSubmit = (data: SlackFormValues) => {
        onSubmit(data);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack channel and message for this node
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>

                    {/* variable name field */}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField control={form.control} name="variableName" render={({field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="slackTest" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Use this variable name to reference the response in other nodes: {" "} {`{{${watchVariableName}.response}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* webhook url field */}
                        <FormField control={form.control} name="webhookUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Webhook URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://api.slack.com/webhooks/sjdhruiw3424u4wfsw" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Get this from Slack: Workspace Settings → Workflows → Webhooks
                                </FormDescription>
                                <FormDescription>
                                    Make sure the webhook URL is for a "Incoming Webhook" and not a "Outgoing Webhook" and "content" variable
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* content field */}
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Slack Content" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* submit button */}
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )   
}
