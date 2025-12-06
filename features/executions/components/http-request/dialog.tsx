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


export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: HttpRequestFormValues) => void;
    defaultValues?: Partial<HttpRequestFormValues>;
}

const formSchema = z.object({
    variableName: z.string().min(1, "Variable name is required").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {message: "variable name should start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    endpoint: z.string().min(1, { message: "Please enter a valid URL" }),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string().optional(),
})


export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
    const form = useForm<HttpRequestFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultValues.endpoint || "",
            method: defaultValues.method || "GET",
            body: defaultValues.body || "",
            variableName: defaultValues.variableName || "",
        },
    })

    // reset form when dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultValues.endpoint || "",
                method: defaultValues.method || "GET",
                body: defaultValues.body || "",
                variableName: defaultValues.variableName || "",
            })
        }
    }, [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "variableName";
    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (data: HttpRequestFormValues) => {
        onSubmit(data);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure the HTTP Request
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>

                    {/* variable name field */}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField control={form.control} name="variableName" render={({field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="variableName" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Use this variable name to reference the response in other nodes: {" "} {`{{${watchVariableName}.httpResponse.data}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* method field */}
                        <FormField control={form.control} name="method" render={({field}) => (
                            <FormItem>
                                <FormLabel>Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    HTTP method to use for the request
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* endpoint field */}
                        <FormField control={form.control} name="endpoint" render={({field}) => (
                            <FormItem>
                                <FormLabel>Endpoint</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://api.example.com/users/{{httpResponse.data}}" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* body field */}
                        {showBodyField && (
                            <FormField control={form.control} name="body" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Request Body</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={'{\n "userId": "{{httpResponse.data.userId}}",\n "name": "{{httpResponse.data.name}}",\n "email": "{{httpResponse.data.email}}"\n}'} className="min-h-[120px] font-mono text-sm" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        JSON with template vriables. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>                 
                </Form>
            </DialogContent>
        </Dialog>
    )
}