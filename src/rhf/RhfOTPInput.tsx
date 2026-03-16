"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { OTPInput, FormField, FormLabel, FormError } from "veloria-ui";
import type { OTPInputProps } from "veloria-ui";

export interface RhfOTPInputProps<T extends FieldValues>
  extends Omit<OTPInputProps, "value" | "onChange" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

export function RhfOTPInput<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: RhfOTPInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel>{label}</FormLabel>}
          <OTPInput
            {...rest}
            value={typeof field.value === "string" ? field.value : ""}
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

RhfOTPInput.displayName = "RhfOTPInput";
