"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Combobox, FormField, FormLabel, FormError } from "veloria-ui";
import type { ComboboxOption } from "veloria-ui";

export interface RhfComboboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: ComboboxOption[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export function RhfCombobox<T extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder,
  searchPlaceholder,
  disabled,
}: RhfComboboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <Combobox
            value={field.value ?? ""}
            onValueChange={field.onChange}
            options={options}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            disabled={disabled}
          />
          {fieldState.error?.message && (
            <FormError>{fieldState.error.message}</FormError>
          )}
        </FormField>
      )}
    />
  );
}

RhfCombobox.displayName = "RhfCombobox";
