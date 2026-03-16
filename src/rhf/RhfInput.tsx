"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Input, FormField, FormLabel, FormError } from "veloria-ui";
import type { InputProps } from "veloria-ui";

export interface RhfInputProps<T extends FieldValues>
  extends Omit<InputProps, "name" | "value" | "onChange" | "onBlur" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

export function RhfInput<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: RhfInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <Input
            {...field}
            {...rest}
            id={name}
            invalid={!!fieldState.error}
          />
          {fieldState.error?.message && (
            <FormError>{fieldState.error.message}</FormError>
          )}
        </FormField>
      )}
    />
  );
}

RhfInput.displayName = "RhfInput";
