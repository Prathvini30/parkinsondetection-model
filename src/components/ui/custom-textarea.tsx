
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";
import { TextareaProps } from "@/components/ui/textarea";

interface CustomTextareaProps extends TextareaProps {
  variant?: "parkinsons" | "default";
}

export const CustomTextarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          variant === "parkinsons" &&
            "border-parkinsons-600/30 focus-visible:ring-parkinsons-600/70",
          className
        )}
        {...props}
      />
    );
  }
);

CustomTextarea.displayName = "CustomTextarea";
