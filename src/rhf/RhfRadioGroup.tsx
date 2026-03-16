"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { RadioGroup, FormField, FormLabel, FormError } from "veloria-ui";
import type { RadioOption } from "veloria-ui";

export interface RhfRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: RadioOption[];
  label?: string;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

export function RhfRadioGroup<T extends FieldValues>({
  name,
  control,
  options,
  label,
  orientation = "vertical",
  disabled,
}: RhfRadioGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel>{label}</FormLabel>}
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            orientation={orientation}
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

RhfRadioGroup.displayName = "RhfRadioGroup";
