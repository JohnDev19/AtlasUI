import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SelectPrimitive from "@radix-ui/react-select";
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

// ─── TextArea ─────────────────────────────────────────────────────────────

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
        resize === "none" && "resize-none",
        resize === "both" && "resize",
        resize === "horizontal" && "resize-x",
        resize === "vertical" && "resize-y",
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

// ─── Select ───────────────────────────────────────────────────────────────

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { invalid?: boolean }
>(({ className, children, invalid, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "atlas-select-trigger flex h-9 w-full items-center justify-between rounded-md",
      "border border-input bg-background px-3 py-2 text-sm",
      "ring-offset-background placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      invalid && "border-destructive focus:ring-destructive",
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <svg className="h-4 w-4 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "atlas-select-content relative z-50 min-w-[8rem] overflow-hidden rounded-md",
        "border border-border bg-popover text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        position === "popper" && "translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm",
      "outline-none focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// ─── Checkbox ─────────────────────────────────────────────────────────────

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
              <label htmlFor={checkboxId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
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

// ─── RadioGroup ───────────────────────────────────────────────────────────

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
                {option.description && <p className="text-xs text-muted-foreground">{option.description}</p>}
              </div>
            </div>
          ))
        : children}
    </RadioGroupPrimitive.Root>
  )
);
RadioGroup.displayName = "RadioGroup";

// ─── Switch ───────────────────────────────────────────────────────────────

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: React.ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const switchSizes = {
  sm: { root: "h-4 w-7", thumb: "h-3 w-3 data-[state=checked]:translate-x-3" },
  md: { root: "h-5 w-9", thumb: "h-4 w-4 data-[state=checked]:translate-x-4" },
  lg: { root: "h-6 w-11", thumb: "h-5 w-5 data-[state=checked]:translate-x-5" },
};

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, size = "md", id, ...props }, ref) => {
    const switchId = id ?? React.useId();
    const sz = switchSizes[size];

    return (
      <div className="atlas-switch flex items-center gap-2.5">
        <SwitchPrimitive.Root
          id={switchId}
          ref={ref}
          className={cn(
            "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "bg-input data-[state=checked]:bg-primary",
            sz.root,
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              "pointer-events-none block rounded-full bg-background shadow-lg ring-0",
              "transition-transform translate-x-0",
              sz.thumb
            )}
          />
        </SwitchPrimitive.Root>
        {(label || description) && (
          <div>
            {label && <label htmlFor={switchId} className="text-sm font-medium cursor-pointer">{label}</label>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

// ─── Slider ───────────────────────────────────────────────────────────────

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("atlas-slider relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {(Array.isArray(props.value) ? props.value : props.defaultValue ?? [0]).map((_, i) => (
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
));
Slider.displayName = "Slider";

// ─── RangeSlider ──────────────────────────────────────────────────────────

export type RangeSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  ({ className, defaultValue = [20, 80], ...props }, ref) => (
    <Slider ref={ref} defaultValue={defaultValue} className={cn("atlas-range-slider", className)} {...props} />
  )
);
RangeSlider.displayName = "RangeSlider";

// ─── DatePicker ───────────────────────────────────────────────────────────

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  invalid?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, invalid, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="atlas-date-picker grid gap-1.5 w-full">
        {label && <label htmlFor={inputId} className="text-sm font-medium">{label}</label>}
        <Input
          ref={ref}
          id={inputId}
          type="date"
          invalid={invalid}
          className={className}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

// ─── TimePicker ───────────────────────────────────────────────────────────

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
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

export {
  Input, inputVariants,
  TextArea,
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent,
  SelectItem, SelectLabel, SelectSeparator,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  RangeSlider,
  DatePicker,
  TimePicker,
};
