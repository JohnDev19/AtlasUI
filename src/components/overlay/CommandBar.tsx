import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { cn } from "../../utils/cn";

export interface CommandBarAction {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandBarProps {
  actions: CommandBarAction[];
  recentIds?: string[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

function useCommandBar(onOpenChange?: (open: boolean) => void) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange?.(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);
}

const CommandBar = React.forwardRef<HTMLDivElement, CommandBarProps>(
  (
    {
      actions,
      recentIds = [],
      open: controlledOpen,
      onOpenChange,
      placeholder = "Search commands…",
      emptyMessage = "No results.",
      className,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    const open = controlledOpen ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;

    useCommandBar(setOpen);

    const grouped = React.useMemo(() => {
      const recent = recentIds
        .map((id) => actions.find((a) => a.id === id))
        .filter(Boolean) as CommandBarAction[];

      if (query.trim()) {
        const q = query.toLowerCase();
        const matched = actions.filter(
          (a) =>
            a.label.toLowerCase().includes(q) ||
            a.description?.toLowerCase().includes(q) ||
            a.keywords?.some((k) => k.toLowerCase().includes(q))
        );
        const byGroup = new Map<string, CommandBarAction[]>();
        for (const a of matched) {
          const g = a.group ?? "Actions";
          if (!byGroup.has(g)) byGroup.set(g, []);
          byGroup.get(g)!.push(a);
        }
        return [...byGroup.entries()].map(([group, items]) => ({ group, items }));
      }

      const result: { group: string; items: CommandBarAction[] }[] = [];
      if (recent.length) result.push({ group: "Recent", items: recent.slice(0, 5) });

      const byGroup = new Map<string, CommandBarAction[]>();
      for (const a of actions) {
        const g = a.group ?? "Actions";
        if (!byGroup.has(g)) byGroup.set(g, []);
        byGroup.get(g)!.push(a);
      }
      for (const [group, items] of byGroup) {
        result.push({ group, items });
      }

      return result;
    }, [actions, recentIds, query]);

    const handleSelect = (action: CommandBarAction) => {
      action.onSelect();
      setOpen(false);
      setQuery("");
    };

    return (
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            )}
          />
          <DialogPrimitive.Content
            ref={ref}
            aria-label="Command bar"
            className={cn(
              "veloria-command-bar fixed left-1/2 top-[20vh] z-50 w-full max-w-xl -translate-x-1/2",
              "rounded-xl border border-border bg-popover shadow-2xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[state=closed]:slide-out-to-top-4 data-[state=open]:slide-in-from-top-4",
              className
            )}
          >
            <Command shouldFilter={false} className="rounded-xl">
              <div className="flex items-center gap-3 border-b border-border px-4">
                <SearchIcon />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={placeholder}
                  className={cn(
                    "flex h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
                    "outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
                <kbd className="hidden rounded border border-border bg-muted px-1.5 text-[11px] text-muted-foreground sm:inline-block">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </Command.Empty>

                {grouped.map(({ group, items }) => (
                  <Command.Group
                    key={group}
                    heading={group}
                    className={cn(
                      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
                      "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
                      "[&_[cmdk-group-heading]]:text-muted-foreground"
                    )}
                  >
                    {items.map((action) => (
                      <Command.Item
                        key={action.id}
                        value={action.id}
                        onSelect={() => handleSelect(action)}
                        className={cn(
                          "flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-sm",
                          "outline-none transition-colors",
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        {action.icon && (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                            {action.icon}
                          </span>
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">{action.label}</span>
                          {action.description && (
                            <span className="truncate text-xs text-muted-foreground">
                              {action.description}
                            </span>
                          )}
                        </div>
                        {action.shortcut && (
                          <div className="ml-auto flex shrink-0 items-center gap-0.5">
                            {action.shortcut.map((key) => (
                              <kbd
                                key={key}
                                className="flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 text-[10px] font-medium text-muted-foreground"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><ArrowKeys /> navigate</span>
                  <span className="flex items-center gap-1"><EnterKey /> select</span>
                </div>
                <span>
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5">⌘K</kbd> to open
                </span>
              </div>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
);
CommandBar.displayName = "CommandBar";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function ArrowKeys() {
  return (
    <span className="flex gap-0.5">
      {["↑", "↓"].map((k) => (
        <kbd key={k} className="rounded border border-border bg-muted px-1 text-[10px]">{k}</kbd>
      ))}
    </span>
  );
}
function EnterKey() {
  return <kbd className="rounded border border-border bg-muted px-1 text-[10px]">↵</kbd>;
}

export { CommandBar, useCommandBar };