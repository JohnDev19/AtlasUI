import * as React from "react";
import { cn } from "../../utils/cn";
import { Input } from "../forms";

// ─── FileUpload ────────────────────────────────────────────────────────────

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  accept?: string;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  dragDrop?: boolean;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, hint, dragDrop = true, onFilesChange, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onFilesChange?.(files);
    };

    return (
      <div className={cn("atlas-file-upload w-full", className)}>
        {dragDrop ? (
          <label
            htmlFor={inputId}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-2 w-full",
              "border-2 border-dashed rounded-lg p-8 cursor-pointer",
              "transition-colors text-center",
              isDragging
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground"
            )}
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="font-medium text-sm">
                {label ?? "Click to upload or drag and drop"}
              </p>
              {hint && <p className="text-xs mt-0.5">{hint}</p>}
            </div>
            <input
              ref={ref}
              id={inputId}
              type="file"
              className="sr-only"
              onChange={(e) => onFilesChange?.(Array.from(e.target.files ?? []))}
              {...props}
            />
          </label>
        ) : (
          <input
            ref={ref}
            id={inputId}
            type="file"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm",
              "file:mr-3 file:border-0 file:bg-primary file:text-primary-foreground file:rounded file:px-2 file:py-1 file:text-xs file:font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            onChange={(e) => onFilesChange?.(Array.from(e.target.files ?? []))}
            {...props}
          />
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

// ─── OTPInput ─────────────────────────────────────────────────────────────

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  className?: string;
  inputClassName?: string;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ length = 6, value = "", onChange, invalid, className, inputClassName }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, char: string) => {
      const chars = value.split("");
      chars[index] = char;
      const next = chars.join("").slice(0, length);
      onChange?.(next);
      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").slice(0, length);
      onChange?.(pasted);
      inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    return (
      <div ref={ref} className={cn("atlas-otp-input flex gap-2", className)} role="group" aria-label="OTP Input">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              "h-10 w-10 text-center text-base font-semibold rounded-md border",
              "transition-shadow focus:outline-none focus:ring-2 focus:ring-ring",
              invalid ? "border-destructive" : "border-input",
              "bg-background",
              inputClassName
            )}
          />
        ))}
      </div>
    );
  }
);
OTPInput.displayName = "OTPInput";

// ─── ColorPicker ──────────────────────────────────────────────────────────

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  swatches?: string[];
  className?: string;
}

const DEFAULT_SWATCHES = [
  "#ef4444","#f97316","#eab308","#22c55e",
  "#3b82f6","#8b5cf6","#ec4899","#64748b",
];

const ColorPicker = ({ value = "#3b82f6", onChange, swatches = DEFAULT_SWATCHES, className }: ColorPickerProps) => (
  <div className={cn("atlas-color-picker flex flex-col gap-3", className)}>
    <div className="flex items-center gap-3">
      <div
        className="h-9 w-9 rounded-md border border-border shadow-sm shrink-0"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="sr-only"
        id="atlas-color-input"
        aria-label="Custom color"
      />
      <label htmlFor="atlas-color-input" className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
        Pick color
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Hex color value"
      />
    </div>
    {swatches.length > 0 && (
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Color swatches">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => onChange?.(swatch)}
            aria-label={`Select color ${swatch}`}
            aria-pressed={value === swatch}
            className={cn(
              "h-6 w-6 rounded border-2 transition-transform hover:scale-110",
              value === swatch ? "border-foreground" : "border-transparent"
            )}
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>
    )}
  </div>
);
ColorPicker.displayName = "ColorPicker";

// ─── SearchInput ──────────────────────────────────────────────────────────

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, loading, value, size = "md", ...props }, ref) => (
    <div className={cn("atlas-search-input relative flex items-center w-full", className)}>
      <span className="absolute left-3 text-muted-foreground pointer-events-none">
        {loading ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        className={cn(
          "flex w-full rounded-md border border-input bg-background text-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "pl-9",
          value && onClear ? "pr-8" : "pr-3",
          size === "sm" && "h-8 text-xs",
          size === "md" && "h-9",
          size === "lg" && "h-10",
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
);
SearchInput.displayName = "SearchInput";

// ─── PasswordInput ────────────────────────────────────────────────────────

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, invalid, size = "md", ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className={cn("atlas-password-input relative flex items-center w-full", className)}>
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            "flex w-full rounded-md border border-input bg-background text-sm pr-10",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            size === "sm" && "h-8 px-2.5 text-xs",
            size === "md" && "h-9 px-3",
            size === "lg" && "h-10 px-4",
            invalid && "border-destructive focus-visible:ring-destructive",
          )}
          aria-invalid={invalid}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// ─── FormField ────────────────────────────────────────────────────────────

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  required?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("atlas-form-field grid gap-1.5 w-full", className)} {...props} />
  )
);
FormField.displayName = "FormField";

// ─── FormLabel ────────────────────────────────────────────────────────────

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, optional, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("atlas-form-label text-sm font-medium leading-none", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
      {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

// ─── FormError ────────────────────────────────────────────────────────────

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn("atlas-form-error flex items-center gap-1.5 text-xs text-destructive", className)}
        {...props}
      >
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {children}
      </p>
    );
  }
);
FormError.displayName = "FormError";

// ─── Combobox ─────────────────────────────────────────────────────────────

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

const Combobox = ({ options, value, onChange, placeholder = "Select option...", searchPlaceholder = "Search...", emptyText = "No results found.", className, disabled }: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("atlas-combobox relative w-full", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label ?? placeholder}
        </span>
        <svg className="h-4 w-4 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          <div className="p-1 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-2 py-1.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
          <div role="listbox" className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  disabled={option.disabled}
                  onClick={() => { onChange?.(option.value); setOpen(false); setSearch(""); }}
                  className={cn(
                    "relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 pl-8 text-sm",
                    "hover:bg-accent hover:text-accent-foreground outline-none",
                    "disabled:pointer-events-none disabled:opacity-50",
                    option.value === value && "bg-accent"
                  )}
                >
                  {option.value === value && (
                    <svg className="absolute left-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
Combobox.displayName = "Combobox";

// ─── MultiSelect ──────────────────────────────────────────────────────────

export interface MultiSelectProps {
  options: ComboboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
  className?: string;
}

const MultiSelect = ({ options, value = [], onChange, placeholder = "Select...", maxDisplay = 3, className }: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const toggle = (optValue: string) => {
    onChange?.(value.includes(optValue) ? value.filter((v) => v !== optValue) : [...value, optValue]);
  };

  const selectedLabels = value
    .slice(0, maxDisplay)
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean);

  return (
    <div className={cn("atlas-multi-select relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-[2.25rem] w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <>
            {selectedLabels.map((label, i) => (
              <span key={i} className="inline-flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-xs font-medium">
                {label}
                <svg className="h-3 w-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); const v = options.find((o) => o.label === label)?.value; if (v) toggle(v); }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            ))}
            {value.length > maxDisplay && (
              <span className="text-xs text-muted-foreground">+{value.length - maxDisplay} more</span>
            )}
          </>
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          <div role="listbox" aria-multiselectable="true" className="max-h-60 overflow-y-auto p-1">
            {options.map((option) => (
              <button
                key={option.value}
                role="option"
                aria-selected={value.includes(option.value)}
                onClick={() => toggle(option.value)}
                className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 pl-8 text-sm hover:bg-accent"
              >
                {value.includes(option.value) && (
                  <svg className="absolute left-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
MultiSelect.displayName = "MultiSelect";

export {
  FileUpload,
  OTPInput,
  ColorPicker,
  SearchInput,
  PasswordInput,
  Combobox,
  MultiSelect,
  FormField,
  FormLabel,
  FormError,
};
