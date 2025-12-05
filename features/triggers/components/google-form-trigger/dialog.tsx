'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams<{ workflowId: string }>();
    const workflowId = params.workflowId;

    // create the webhook url
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy webhook URL to clipboard");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's Apps Script to trigger the workflow when a google form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input value={webhookUrl} id="webhook-url" readOnly className="font-mono text-sm" />
                            <Button type="button" size="icon" variant="outline" onClick={copyToClipboard}>
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Setup instructions:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Go to your Google Form</li>
                                <li>Click on the three dots menu → Script editor</li>
                                <li>Copy and paste the following code below</li>
                                <li>Replace the WEBHOOK_URL with the webhook URL above</li>
                                <li>Save and click "Triggers" → + Add Trigger</li>
                                <li>Select: From form → On form submit → Save</li>
                            </ul>
                        </div>
                        <div className="rounded-lg bg-muted p-4 space-y-3">
                            <h4 className="font-medium text-sm">Google Apps Script Code</h4>
                            <Button type="button" size="sm" variant="outline" onClick={async () => {
                                const script = generateGoogleFormScript(webhookUrl);
                                try {
                                    await navigator.clipboard.writeText(script);
                                    toast.success("Google Apps Script copied to clipboard");
                                } catch (error) {
                                    toast.error("Failed to copy Google Apps Script to clipboard");
                                }
                            }}>
                                <CopyIcon className="size-4 mr-2" />
                                Copy Google Apps Script
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                This script includes your webhook URL and handles form submission.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Google Form Trigger</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>
                                <code>
                                    {"{{googleForm.respondentEmail}}"}
                                </code>
                                - Respondent's email
                            </li>
                            <li>
                                <code>
                                    {"{{googleForm.responses['Question Name']}}"}
                                </code>
                                - Response to the question
                            </li>
                            <li>
                                <code>
                                    {"{{json googleForm.responses}}"}
                                </code>
                                - All responses as JSON
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}