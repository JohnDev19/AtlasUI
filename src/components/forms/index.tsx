import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../../utils/cn";

// ─── TextArea ──────────────────────────────────────────────────────────────

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, hasError, resize = "vertical", style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "veloria-textarea flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-destructive focus-visible:ring-destructive",
        className
      )}
      style={{ resize, ...style }}
      {...props}
    />
  )
);
TextArea.displayName = "TextArea";

// ─── Select (Radix) ────────────────────────────────────────────────────────

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { hasError?: boolean }
>(({ className, children, hasError, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "veloria-select-trigger flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
      "ring-offset-background placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      hasError && "border-destructive focus:ring-destructive",
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
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "veloria-select-content relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
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
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";

// ─── Checkbox ──────────────────────────────────────────────────────────────

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  description?: string;
  hasError?: boolean;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, description, hasError, id, ...props }, ref) => {
    const innerId = id ?? React.useId();
    return (
      <div className="veloria-checkbox flex items-start gap-3">
        <CheckboxPrimitive.Root
          ref={ref}
          id={innerId}
          className={cn(
            "peer mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            hasError && "border-destructive",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && <label htmlFor={innerId} className={cn("text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50", hasError && "text-destructive")}>{label}</label>}
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
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  options?: RadioOption[];
  hasError?: boolean;
}

const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, options, hasError, children, ...props }, ref) => (
    <RadioGroupPrimitive.Root ref={ref} className={cn("veloria-radio-group flex flex-col gap-3", className)} {...props}>
      {options
        ? options.map((opt) => (
            <div key={opt.value} className="flex items-start gap-3">
              <RadioGroupPrimitive.Item
                id={`radio-${opt.value}`}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                  hasError && "border-destructive"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-current" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
              <div className="flex flex-col gap-0.5">
                <label htmlFor={`radio-${opt.value}`} className="text-sm font-medium leading-none cursor-pointer">{opt.label}</label>
                {opt.description && <p className="text-xs text-muted-foreground">{opt.description}</p>}
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
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, size = "md", id, ...props }, ref) => {
    const innerId = id ?? React.useId();
    return (
      <div className="veloria-switch flex items-center gap-3">
        <SwitchPrimitive.Root
          ref={ref}
          id={innerId}
          className={cn(
            "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
            size === "sm" && "h-4 w-7",
            size === "md" && "h-5 w-9",
            size === "lg" && "h-6 w-11",
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
              size === "sm" && "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
              size === "md" && "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
              size === "lg" && "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
            )}
          />
        </SwitchPrimitive.Root>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && <label htmlFor={innerId} className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50">{label}</label>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

// ─── Slider ────────────────────────────────────────────────────────────────

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
  formatValue?: (v: number) => string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, showValue, formatValue, ...props }, ref) => {
    const val = props.value ?? props.defaultValue ?? [0];
    return (
      <div className="veloria-slider flex items-center gap-3">
        <SliderPrimitive.Root
          ref={ref}
          className={cn("relative flex w-full touch-none select-none items-center", className)}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          {(Array.isArray(val) ? val : [val]).map((_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </SliderPrimitive.Root>
        {showValue && Array.isArray(val) && (
          <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums">
            {formatValue ? formatValue(val[0]) : val[0]}
          </span>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";

// ─── RangeSlider ───────────────────────────────────────────────────────────

export interface RangeSliderProps extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, "value" | "onValueChange"> {
  value?: [number, number];
  onValueChange?: (val: [number, number]) => void;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}

const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  ({ className, value, onValueChange, showValues, formatValue, ...props }, ref) => (
    <div className="veloria-range-slider flex items-center gap-3">
      {showValues && value && (
        <span className="w-10 shrink-0 text-sm font-medium tabular-nums">{formatValue ? formatValue(value[0]) : value[0]}</span>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        value={value}
        onValueChange={(v) => onValueChange?.(v as [number, number])}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </SliderPrimitive.Root>
      {showValues && value && (
        <span className="w-10 shrink-0 text-sm font-medium tabular-nums">{formatValue ? formatValue(value[1]) : value[1]}</span>
      )}
    </div>
  )
);
RangeSlider.displayName = "RangeSlider";

// ─── DatePicker ────────────────────────────────────────────────────────────

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, hasError, errorMessage, id, ...props }, ref) => {
    const innerId = id ?? React.useId();
    return (
      <div className="veloria-date-picker flex flex-col gap-1.5">
        {label && <label htmlFor={innerId} className="text-sm font-medium leading-none">{label}</label>}
        <input
          ref={ref}
          type="date"
          id={innerId}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {hasError && errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

// ─── TimePicker ────────────────────────────────────────────────────────────

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, label, hasError, errorMessage, id, ...props }, ref) => {
    const innerId = id ?? React.useId();
    return (
      <div className="veloria-time-picker flex flex-col gap-1.5">
        {label && <label htmlFor={innerId} className="text-sm font-medium leading-none">{label}</label>}
        <input
          ref={ref}
          type="time"
          id={innerId}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {hasError && errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";

// ─── FormField, FormLabel, FormError ───────────────────────────────────────

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, description, error, required, htmlFor, children, ...props }, ref) => (
    <div ref={ref} className={cn("veloria-form-field flex flex-col gap-1.5", className)} {...props}>
      {label && (
        <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none", error && "text-destructive")}>
          {label}{required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {description && !error && <p className="text-xs text-muted-foreground">{description}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
);
FormField.displayName = "FormField";

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean; hasError?: boolean }>(
  ({ className, required, hasError, children, ...props }, ref) => (
    <label ref={ref} className={cn("veloria-form-label text-sm font-medium leading-none", hasError && "text-destructive", className)} {...props}>
      {children}{required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

const FormError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("veloria-form-error text-xs text-destructive", className)} role="alert" {...props} />
  )
);
FormError.displayName = "FormError";

export {
  TextArea,
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  RangeSlider,
  DatePicker,
  TimePicker,
  FormField,
  FormLabel,
  FormError,
};

export type {
  TextAreaProps,
  CheckboxProps,
  RadioOption,
  RadioGroupProps,
  SwitchProps,
  SliderProps,
  RangeSliderProps,
  DatePickerProps,
  TimePickerProps,
  FormFieldProps,
};
