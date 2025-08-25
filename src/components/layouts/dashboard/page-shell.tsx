import React from "react";

type Props = {
  title: string;
  description: string;
  actionComponent: React.ReactNode;
};

export function AppPageShell({ actionComponent, description, title }: Props) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1 break-words">
          {title}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground break-words">
          {description}
        </p>
      </div>

      <div className="flex-shrink-0 w-full md:w-auto">{actionComponent}</div>
    </div>
  );
}
