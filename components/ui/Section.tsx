import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const sectionVariants = cva("w-full relative overflow-hidden", {
  variants: {
    rhythm: {
      none: "py-0",
      standard: "py-12 md:py-space-4 lg:py-space-5",
      editorial: "py-16 md:py-space-6 lg:py-space-7 xl:py-space-8",
    },
  },
  defaultVariants: {
    rhythm: "standard",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, rhythm, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ rhythm }), className)}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

export { Section, sectionVariants };
