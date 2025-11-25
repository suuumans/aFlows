'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

export const AddNodeButton = memo(() => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Button size="icon" variant="outline" className="bg-background" onClick={() => {}}>
            <PlusIcon className="size-4" />
        </Button>
    )
})

AddNodeButton.displayName = "AddNodeButton";
