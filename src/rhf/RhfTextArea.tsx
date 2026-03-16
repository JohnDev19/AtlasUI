"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TextArea, FormField, FormLabel, FormError } from "veloria-ui";
import type { TextAreaProps } from "veloria-ui";

export interface RhfTextAreaProps<T extends FieldValues>
  extends Omit<TextAreaProps, "name" | "value" | "onChange" | "onBlur" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

export function RhfTextArea<T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: RhfTextAreaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <TextArea
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

RhfTextArea.displayName = "RhfTextArea";
