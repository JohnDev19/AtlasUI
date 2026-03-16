import * as React from "react";
import { cn } from "../../utils/cn";

// ─── FileUpload ────────────────────────────────────────────────────────────

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  onFilesChange?: (files: File[]) => void;
  dragActive?: boolean;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, description, accept, maxSizeMB, onFilesChange, id, ...props }, ref) => {
    const innerId = id ?? React.useId();
    const [dragging, setDragging] = React.useState(false);
    const [files, setFiles] = React.useState<File[]>([]);

    const handleFiles = (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming).filter((f) => !maxSizeMB || f.size <= maxSizeMB * 1024 * 1024);
      setFiles(arr);
      onFilesChange?.(arr);
    };

    return (
      <div className={cn("veloria-file-upload", className)}>
        <label
          htmlFor={innerId}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium">{label ?? "Drop files here or click to upload"}</p>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            {maxSizeMB && <p className="mt-1 text-xs text-muted-foreground">Max {maxSizeMB}MB</p>}
          </div>
          <input ref={ref} id={innerId} type="file" accept={accept} className="sr-only" onChange={(e) => handleFiles(e.target.files)} {...props} />
        </label>
        {files.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                <span className="flex-1 truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)}KB</span>
                <button type="button" onClick={() => { const n = files.filter((_, j) => j !== i); setFiles(n); onFilesChange?.(n); }} className="shrink-0 rounded p-0.5 hover:bg-muted transition-colors" aria-label="Remove file">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

// ─── OTPInput ──────────────────────────────────────────────────────────────

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  hasError?: boolean;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value = "", onChange, hasError, className, inputClassName, autoFocus }) => {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const update = (idx: number, char: string) => {
    const arr = [...digits];
    arr[idx] = char;
    const next = arr.join("");
    onChange?.(next);
    if (char && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  return (
    <div className={cn("veloria-otp-input flex items-center gap-2", className)}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={d}
          autoFocus={autoFocus && i === 0}
          aria-label={`OTP digit ${i + 1}`}
          onChange={(e) => { const v = e.target.value.slice(-1); if (/^\d?$/.test(v)) update(i, v); }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d && i > 0) { refs.current[i - 1]?.focus(); }
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            onChange?.(pasted.padEnd(length, "").slice(0, length));
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className={cn(
            "h-11 w-11 rounded-md border text-center text-lg font-semibold tabular-nums",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "bg-background transition-colors",
            hasError ? "border-destructive text-destructive" : "border-input",
            d && "border-primary",
            inputClassName
          )}
        />
      ))}
    </div>
  );
};

// ─── ColorPicker ───────────────────────────────────────────────────────────

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  swatches?: string[];
  className?: string;
}

const defaultSwatches = [
  "#ef4444","#f97316","#f59e0b","#84cc16","#22c55e","#14b8a6",
  "#3b82f6","#8b5cf6","#ec4899","#64748b","#000000","#ffffff",
];

const ColorPicker: React.FC<ColorPickerProps> = ({ value = "#3b82f6", onChange, swatches = defaultSwatches, className }) => {
  const [hex, setHex] = React.useState(value);
  const update = (c: string) => { setHex(c); onChange?.(c); };

  return (
    <div className={cn("veloria-color-picker flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-2">
        {swatches.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => update(s)}
            className={cn("h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", hex === s ? "border-foreground" : "border-transparent")}
            style={{ backgroundColor: s }}
            aria-label={s}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 rounded-md border border-border" style={{ backgroundColor: hex }} />
        <input
          type="text"
          value={hex}
          onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) update(e.target.value); }}
          className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="#000000"
          maxLength={7}
        />
        <input type="color" value={hex} onChange={(e) => update(e.target.value)} className="h-8 w-10 cursor-pointer rounded-md border border-input bg-background p-0.5" aria-label="Color picker" />
      </div>
    </div>
  );
};

// ─── SearchInput ───────────────────────────────────────────────────────────

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  loading?: boolean;
  onClear?: () => void;
  inputSize?: "sm" | "md" | "lg";
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, loading, onClear, value, inputSize = "md", ...props }, ref) => (
    <div className={cn("veloria-search-input relative flex items-center", className)}>
      <span className="absolute left-3 text-muted-foreground pointer-events-none" aria-hidden="true">
        {loading
          ? <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          : <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        }
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        className={cn(
          "flex w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm ring-offset-background",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden",
          inputSize === "sm" && "h-8",
          inputSize === "md" && "h-9",
          inputSize === "lg" && "h-10",
        )}
        {...props}
      />
      {onClear && value && (
        <button type="button" onClick={onClear} className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Clear search">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  )
);
SearchInput.displayName = "SearchInput";

// ─── PasswordInput ─────────────────────────────────────────────────────────

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, hasError, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="veloria-password-input relative flex items-center">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show
            ? <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            : <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          }
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// ─── Combobox ──────────────────────────────────────────────────────────────

export interface ComboboxOption { value: string; label: string; }

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

const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, placeholder = "Select…", searchPlaceholder = "Search…", emptyText = "No results.", className, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className={cn("veloria-combobox relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selected && "text-muted-foreground"
        )}
      >
        {selected?.label ?? placeholder}
        <svg className="h-4 w-4 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          <div className="border-b border-border p-2">
            <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <ul className="max-h-56 overflow-auto p-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="py-4 text-center text-sm text-muted-foreground">{emptyText}</li>
            ) : filtered.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange?.(opt.value); setOpen(false); setQuery(""); }}
                className={cn(
                  "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  opt.value === value && "bg-accent text-accent-foreground font-medium"
                )}
              >
                {opt.value === value && <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── MultiSelect ───────────────────────────────────────────────────────────

export interface MultiSelectProps {
  options: ComboboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  max?: number;
  className?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, value = [], onChange, placeholder = "Select…", max, className, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  React.useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const toggle = (val: string) => {
    if (value.includes(val)) { onChange?.(value.filter((v) => v !== val)); }
    else if (!max || value.length < max) { onChange?.([...value, val]); }
  };

  const selected = options.filter((o) => value.includes(o.value));

  return (
    <div ref={ref} className={cn("veloria-multi-select relative", className)}>
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex min-h-[2.25rem] w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 cursor-pointer",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {selected.length === 0 && <span className="text-sm text-muted-foreground">{placeholder}</span>}
        {selected.map((opt) => (
          <span key={opt.value} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {opt.label}
            <button type="button" onClick={(e) => { e.stopPropagation(); toggle(opt.value); }} className="hover:text-primary/70" aria-label={`Remove ${opt.label}`}>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </span>
        ))}
        <svg className="ml-auto h-4 w-4 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          <div className="border-b border-border p-2">
            <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <ul className="max-h-56 overflow-auto p-1" role="listbox" aria-multiselectable="true">
            {filtered.map((opt) => {
              const checked = value.includes(opt.value);
              const atMax = !!max && value.length >= max && !checked;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  onClick={() => !atMax && toggle(opt.value)}
                  className={cn(
                    "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                    !atMax && "hover:bg-accent hover:text-accent-foreground",
                    atMax && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className={cn("h-4 w-4 rounded-sm border shrink-0 flex items-center justify-center", checked ? "bg-primary border-primary text-primary-foreground" : "border-input")}>
                    {checked && <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {opt.label}
                </li>
              );
            })}
          </ul>
          {max && <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">{value.length}/{max} selected</p>}
        </div>
      )}
    </div>
  );
};

// ─── PhoneInput ────────────────────────────────────────────────────────────

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  hasError?: boolean;
  defaultCountry?: string;
}

const countryCodes = [
  { code: "+1",  flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+63", flag: "🇵🇭", name: "PH" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
];

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, hasError, defaultCountry = "+1", ...props }, ref) => {
    const [country, setCountry] = React.useState(defaultCountry);
    const selected = countryCodes.find((c) => c.code === country) ?? countryCodes[0];
    return (
      <div className={cn("veloria-phone-input flex", className)}>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={cn(
            "h-9 rounded-l-md border border-r-0 border-input bg-background pl-2 pr-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
            hasError && "border-destructive"
          )}
          aria-label="Country code"
        >
          {countryCodes.map((c) => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
        <input
          ref={ref}
          type="tel"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "flex h-9 w-full rounded-r-md border border-input bg-background px-3 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive"
          )}
          placeholder={`${selected.code} xxx-xxxx`}
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

// ─── TagInput ──────────────────────────────────────────────────────────────

export interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  allowDuplicates?: boolean;
  className?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ value = [], onChange, placeholder = "Add tag…", max, allowDuplicates = false, className, disabled }) => {
  const [input, setInput] = React.useState("");

  const add = () => {
    const tag = input.trim();
    if (!tag) return;
    if (!allowDuplicates && value.includes(tag)) return;
    if (max && value.length >= max) return;
    onChange?.([...value, tag]);
    setInput("");
  };

  return (
    <div className={cn("veloria-tag-input flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring", className)}>
      {value.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {tag}
          {!disabled && (
            <button type="button" onClick={() => onChange?.(value.filter((_, j) => j !== i))} aria-label={`Remove ${tag}`}>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } if (e.key === "Backspace" && !input && value.length) onChange?.(value.slice(0, -1)); }}
        placeholder={(!max || value.length < max) ? placeholder : `Max ${max} tags`}
        disabled={disabled || (!!max && value.length >= max)}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  );
};

// ─── CurrencyInput ─────────────────────────────────────────────────────────

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  locale?: string;
  hasError?: boolean;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, currency = "USD", locale = "en-US", hasError, ...props }, ref) => {
    const [raw, setRaw] = React.useState(value?.toString() ?? "");
    const symbol = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(0).find((p) => p.type === "currency")?.value ?? "$";

    return (
      <div className="veloria-currency-input relative flex items-center">
        <span className="absolute left-3 text-sm text-muted-foreground pointer-events-none">{symbol}</span>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.]/g, "");
            setRaw(v);
            const num = parseFloat(v);
            if (!isNaN(num)) onChange?.(num);
          }}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

// ─── RatingInput ───────────────────────────────────────────────────────────

export interface RatingInputProps {
  value?: number;
  onChange?: (rating: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  allowClear?: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({ value = 0, onChange, max = 5, readOnly, size = "md", className, allowClear = true }) => {
  const [hover, setHover] = React.useState(0);
  const starSize = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" }[size];

  return (
    <div className={cn("veloria-rating-input flex items-center gap-0.5", readOnly && "pointer-events-none", className)} role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          onClick={() => { if (readOnly) return; if (allowClear && star === value) onChange?.(0); else onChange?.(star); }}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 focus-visible:outline-none"
        >
          <svg
            className={cn(starSize, "transition-colors")}
            fill={(hover || value) >= star ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              className={(hover || value) >= star ? "text-yellow-400" : "text-muted-foreground/40"}
            />
          </svg>
        </button>
      ))}
      {!readOnly && value > 0 && allowClear && (
        <button type="button" onClick={() => onChange?.(0)} className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label="Clear rating">Clear</button>
      )}
    </div>
  );
};

export {
  FileUpload, OTPInput, ColorPicker, SearchInput, PasswordInput,
  Combobox, MultiSelect, PhoneInput, TagInput, CurrencyInput, RatingInput,
};

export type {
  FileUploadProps, OTPInputProps, ColorPickerProps, SearchInputProps,
  PasswordInputProps, ComboboxOption, ComboboxProps, MultiSelectProps,
  PhoneInputProps, TagInputProps, CurrencyInputProps, RatingInputProps,
};
