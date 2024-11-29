import React from "react";
import { cn } from "@/lib/utils";

const Breadcrumb = ({
    children,
    className,
    ...props
}) => {
    return (
        <nav
            className={cn(
                "relative flex flex-wrap items-center text-sm text-muted-foreground",
                className
            )}
            {...props}
        >
            <ol className="flex items-center space-x-2">{children}</ol>
        </nav>
    );
};

const BreadcrumbItem = ({
    children,
    isCurrentPage,
    className,
    ...props
}) => {
    return (
        <li
            className={cn(
                "inline-flex items-center space-x-2",
                isCurrentPage && "text-foreground font-medium",
                className
            )}
            {...props}
        >
            {children}
        </li>
    );
};

const BreadcrumbLink = React.forwardRef(({
    children,
    className,
    ...props
}, ref) => {
    return (
        <a
            ref={ref}
            className={cn(
                "hover:text-foreground transition-colors",
                className
            )}
            {...props}
        >
            {children}
        </a>
    );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink };
