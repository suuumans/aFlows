'use client';

import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

export const AddNodeButton = memo(() => {
    const [open, setOpen] = useState(false);
    return (
        <NodeSelector open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="outline" className="bg-background" onClick={() => setOpen(true)}>
                <PlusIcon className="size-4" />
            </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton";
