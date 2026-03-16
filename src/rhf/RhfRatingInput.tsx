"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { RatingInput, FormField, FormLabel, FormError } from "veloria-ui";
import type { RatingInputProps } from "veloria-ui";

export interface RhfRatingInputProps<T extends FieldValues>
  extends Omit<RatingInputProps, "value" | "onChange" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

export function RhfRatingInput<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: RhfRatingInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel>{label}</FormLabel>}
          <RatingInput
            {...rest}
            value={typeof field.value === "number" ? field.value : 0}
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

RhfRatingInput.displayName = "RhfRatingInput";
