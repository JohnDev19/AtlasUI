"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Checkbox, FormField, FormError } from "veloria-ui";
import type { CheckboxProps } from "veloria-ui";

export interface RhfCheckboxProps<T extends FieldValues>
  extends Omit<CheckboxProps, "name" | "checked" | "onCheckedChange" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
}

export function RhfCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  description,
  ...rest
}: RhfCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          <Checkbox
            {...rest}
            id={name}
            label={label}
            description={description}
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
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

RhfCheckbox.displayName = "RhfCheckbox";
