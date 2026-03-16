"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { MultiSelect, FormField, FormLabel, FormError } from "veloria-ui";
import type { MultiSelectProps } from "veloria-ui";

export interface RhfMultiSelectProps<T extends FieldValues>
  extends Omit<MultiSelectProps, "value" | "onChange" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

export function RhfMultiSelect<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: RhfMultiSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <MultiSelect
            {...rest}
            value={Array.isArray(field.value) ? field.value : []}
            onChange={field.onChange}
          />
          {fieldState.error?.message && (
            <FormError>{fieldState.error.message}</FormError>
          )}
        </FormField>
      )}
    />
  );
}

RhfMultiSelect.displayName = "RhfMultiSelect";
