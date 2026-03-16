import * as React from "react";
import * as CheckboxPrimitive   from "@radix-ui/react-checkbox";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive     from "@radix-ui/react-switch";
import * as SliderPrimitive     from "@radix-ui/react-slider";
import * as SelectPrimitive     from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// ─── Input ─────────────────────────────────────────────────────────────────

const inputVariants = cva(
  [
    "atlas-input flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
    "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground",
    "transition-shadow duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
      invalid: {
        true: "border-destructive focus-visible:ring-destructive",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, invalid, leftElement, rightElement, ...props }, ref) => {
    if (leftElement || rightElement) {
      return (
        <div className="relative flex items-center w-full">
          {leftElement && (
            <span className="absolute left-3 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4 pointer-events-none">
              {leftElement}
            </span>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ size, invalid: invalid ?? false }),
              leftElement && "pl-9",
              rightElement && "pr-9",
              className
            )}
            ref={ref}
            aria-invalid={invalid}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
              {rightElement}
            </span>
          )}
        </div>
      );
    }
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, invalid: invalid ?? false }), className)}
        ref={ref}
        aria-invalid={invalid}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// ─── TextArea ──────────────────────────────────────────────────────────────

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, invalid, resize = "vertical", ...props }, ref) => (
    <textarea
      className={cn(
        "atlas-textarea flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
        resize === "none"       && "resize-none",
        resize === "both"       && "resize",
        resize === "horizontal" && "resize-x",
        resize === "vertical"   && "resize-y",
        invalid && "border-destructive focus-visible:ring-destructive",
        className
      )}
      ref={ref}
      aria-invalid={invalid}
      {...props}
    />
  )
);
TextArea.displayName = "TextArea";

// ─── Select ────────────────────────────────────────────────────────────────
//
//  Fully custom dropdown — no native OS picker, no browser default styles.
//  Animations:
//    • Opens  → fade + slide down from trigger  (data-[side=bottom])
//    • Opens  → fade + slide up from trigger    (data-[side=top])
//    • Closes → fade + scale out (zoom-out-95)
//  Scroll buttons appear when the list overflows, replacing the OS scrollbar.
//
// ─────────────────────────────────────────────────────────────────────────

const Select        = SelectPrimitive.Root;
const SelectGroup   = SelectPrimitive.Group;
const SelectValue   = SelectPrimitive.Value;

// ── Trigger ────────────────────────────────────────────────────────────────

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { invalid?: boolean }
>(({ className, children, invalid, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "atlas-select-trigger",
      // Layout
      "flex h-9 w-full items-center justify-between gap-2 rounded-md",
      // Surface
      "border border-input bg-background px-3 py-2",
      // Text
      "text-sm text-left [&>span]:line-clamp-1",
      // Focus ring
      "ring-offset-background",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      // Transitions
      "transition-all duration-150",
      // Hover — subtle background lift
      "hover:bg-accent/40",
      // States
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Open state — keep ring visible while open
      "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
      // Error
      invalid && "border-destructive focus:ring-destructive data-[state=open]:ring-destructive",
      className
    )}
    {...props}
  >
    {children}
    {/* Chevron — rotates 180° when open */}
    <SelectPrimitive.Icon asChild>
      <svg
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground",
          "transition-transform duration-200",
          // Radix puts data-[state=open] on the Trigger itself
          "group-data-[state=open]:rotate-180",
          // Tailwind can't target parent state, so we animate via CSS below
          // (see veloria.css .atlas-select-trigger[data-state=open] svg)
        )}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// ── Scroll buttons ─────────────────────────────────────────────────────────

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1.5",
      "text-muted-foreground hover:text-foreground transition-colors",
      "border-b border-border/50 bg-popover",
      className
    )}
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1.5",
      "text-muted-foreground hover:text-foreground transition-colors",
      "border-t border-border/50 bg-popover",
      className
    )}
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// ── Content (the dropdown panel) ───────────────────────────────────────────

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", sideOffset = 6, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={sideOffset}
      className={cn(
        "atlas-select-content",
        // Stacking + overflow
        "relative z-50 overflow-hidden",
        // Shape & surface
        "min-w-[var(--radix-select-trigger-width)] rounded-lg",
        "border border-border bg-popover text-popover-foreground",
        // Layered shadow — soft ambient + strong key
        "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_10px_25px_-5px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]",
        "dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_10px_25px_-5px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.2)]",

        // ── Open animations ──────────────────────────────────────────────
        "data-[state=open]:animate-in",
        "data-[state=open]:fade-in-0",
        // Slide origin depends on which side the popover appears on
        "data-[state=open]:data-[side=bottom]:slide-in-from-top-2",
        "data-[state=open]:data-[side=top]:slide-in-from-bottom-2",
        "data-[state=open]:data-[side=left]:slide-in-from-right-2",
        "data-[state=open]:data-[side=right]:slide-in-from-left-2",
        // Slight zoom from 97% → 100%
        "data-[state=open]:zoom-in-[0.97]",

        // ── Close animations ─────────────────────────────────────────────
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=closed]:data-[side=bottom]:slide-out-to-top-2",
        "data-[state=closed]:data-[side=top]:slide-out-to-bottom-2",

        // Popper width alignment
        position === "popper" && "w-full",
        className
      )}
      {...props}
    >
      {/* Scroll up button — only visible when list overflows at top */}
      <SelectScrollUpButton />

      {/* Viewport — the scrollable list */}
      <SelectPrimitive.Viewport
        className={cn(
          "p-1.5",
          // When using popper positioning, match trigger width and cap height
          position === "popper" && [
            "min-w-[var(--radix-select-trigger-width)]",
            "max-h-[min(var(--radix-select-content-available-height),18rem)]",
          ]
        )}
      >
        {children}
      </SelectPrimitive.Viewport>

      {/* Scroll down button — only visible when list overflows at bottom */}
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// ── Group label ────────────────────────────────────────────────────────────

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider",
      "text-muted-foreground/70 select-none",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// ── Item ───────────────────────────────────────────────────────────────────

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "atlas-select-item",
      // Layout
      "relative flex w-full cursor-default select-none items-center",
      "rounded-md py-2 pl-8 pr-3 text-sm",
      // Transitions
      "outline-none transition-colors duration-100",
      // Hover & keyboard focus — use accent bg
      "focus:bg-accent focus:text-accent-foreground",
      // Selected state — slightly stronger than hover
      "data-[state=checked]:font-medium",
      "data-[state=checked]:text-foreground",
      // Disabled
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      className
    )}
    {...props}
  >
    {/* Check indicator — appears only on selected item */}
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg
          className="h-3.5 w-3.5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// ── Separator ──────────────────────────────────────────────────────────────

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border/60", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// ─── Checkbox ──────────────────────────────────────────────────────────────

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode;
  description?: string;
  invalid?: boolean;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, description, invalid, id, ...props }, ref) => {
    const checkboxId = id ?? React.useId();
    return (
      <div className="atlas-checkbox flex items-start gap-2.5">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            invalid && "border-destructive",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {(label || description) && (
          <div className="grid gap-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ─── RadioGroup ────────────────────────────────────────────────────────────

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  options?: RadioOption[];
  orientation?: "horizontal" | "vertical";
}

const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, options, orientation = "vertical", children, ...props }, ref) => (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(
        "atlas-radio-group",
        orientation === "vertical" ? "flex flex-col gap-2" : "flex flex-row flex-wrap gap-4",
        className
      )}
      {...props}
    >
      {options
        ? options.map((option) => (
            <div key={option.value} className="flex items-start gap-2.5">
              <RadioGroupPrimitive.Item
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  "mt-0.5 h-4 w-4 rounded-full border border-primary shrink-0",
                  "ring-offset-background transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "data-[state=checked]:border-primary"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
              <div>
                <label className="text-sm font-medium cursor-pointer">{option.label}</label>
                {option.description && (
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                )}
              </div>
            </div>
          ))
        : children}
    </RadioGroupPrimitive.Root>
  )
);
RadioGroup.displayName = "RadioGroup";

// ─── Switch ────────────────────────────────────────────────────────────────

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: React.ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const switchSizes = {
  sm: { root: "h-4 w-7",  thumb: "h-3 w-3 data-[state=checked]:translate-x-3" },
  md: { root: "h-5 w-9",  thumb: "h-4 w-4 data-[state=checked]:translate-x-4" },
  lg: { root: "h-6 w-11", thumb: "h-5 w-5 data-[state=checked]:translate-x-5" },
};

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, size = "md", id, ...props }, ref) => {
    const switchId = id ?? React.useId();
    const sizes = switchSizes[size];
    return (
      <div className="atlas-switch flex items-center gap-2">
        <SwitchPrimitive.Root
          ref={ref}
          id={switchId}
          className={cn(
            "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
            "transition-colors duration-200 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "bg-input data-[state=checked]:bg-primary",
            sizes.root,
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              "pointer-events-none block rounded-full bg-background shadow-lg ring-0",
              "transition-transform duration-200 ease-in-out",
              "translate-x-0",
              sizes.thumb
            )}
          />
        </SwitchPrimitive.Root>
        {(label || description) && (
          <div className="grid gap-0.5">
            {label && (
              <label
                htmlFor={switchId}
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

// ─── Slider ────────────────────────────────────────────────────────────────

export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "atlas-slider relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {((props.value ?? props.defaultValue) as number[] | undefined ?? [0]).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "block h-4 w-4 rounded-full border-2 border-primary bg-background shadow",
            "ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
);
Slider.displayName = "Slider";

// ─── RangeSlider ───────────────────────────────────────────────────────────

export type RangeSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  ({ className, defaultValue = [20, 80], ...props }, ref) => (
    <Slider
      ref={ref}
      defaultValue={defaultValue}
      className={cn("atlas-range-slider", className)}
      {...props}
    />
  )
);
RangeSlider.displayName = "RangeSlider";

// ─── DatePicker ────────────────────────────────────────────────────────────

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  invalid?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, invalid, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="atlas-date-picker grid gap-1.5 w-full">
        {label && <label htmlFor={inputId} className="text-sm font-medium">{label}</label>}
        <Input ref={ref} id={inputId} type="date" invalid={invalid} className={className} {...props} />
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

// ─── TimePicker ────────────────────────────────────────────────────────────

export interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  invalid?: boolean;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, label, invalid, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="atlas-time-picker grid gap-1.5 w-full">
        {label && <label htmlFor={inputId} className="text-sm font-medium">{label}</label>}
        <Input ref={ref} id={inputId} type="time" invalid={invalid} className={className} {...props} />
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";

// ─── v0.1.4 — New forms components (standalone files) ────────────────────
export { NumberInput } from "./NumberInput";
export type { NumberInputProps } from "./NumberInput";

export { AvatarUpload } from "./AvatarUpload";
export type { AvatarUploadProps } from "./AvatarUpload";

export { DateRangePicker } from "./DateRangePicker";
export type { DateRange, DateRangePickerProps } from "./DateRangePicker";

// ─── Exports ───────────────────────────────────────────────────────────────

export {
  Input, inputVariants,
  TextArea,
  Select, SelectGroup, SelectValue,
  SelectTrigger,
  SelectContent,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  RangeSlider,
  DatePicker,
  TimePicker,
};