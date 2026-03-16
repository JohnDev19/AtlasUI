"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  FormField,
  FormLabel,
  FormError,
} from "veloria-ui";

export interface RhfSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RhfSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: RhfSelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function RhfSelect<T extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = "Select an option",
  disabled,
}: RhfSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              onBlur={field.onBlur}
              data-invalid={!!fieldState.error || undefined}
              className={
                fieldState.error
                  ? "border-destructive focus:ring-destructive"
                  : undefined
              }
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error?.message && (
            <FormError>{fieldState.error.message}</FormError>
          )}
        </FormField>
      )}
    />
  );
}

RhfSelect.displayName = "RhfSelect";
