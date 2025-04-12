
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "parkinsons" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          variant === "parkinsons" &&
            "bg-parkinsons-600 text-white hover:bg-parkinsons-700",
          className
        )}
        variant={variant !== "parkinsons" ? variant : "default"}
        {...props}
      />
    );
  }
);

CustomButton.displayName = "CustomButton";
