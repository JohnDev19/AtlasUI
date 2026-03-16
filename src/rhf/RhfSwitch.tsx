"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Switch, FormField, FormError } from "veloria-ui";
import type { SwitchProps } from "veloria-ui";

export interface RhfSwitchProps<T extends FieldValues>
  extends Omit<SwitchProps, "name" | "checked" | "onCheckedChange" | "ref"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
}

export function RhfSwitch<T extends FieldValues>({
  name,
  control,
  label,
  description,
  ...rest
}: RhfSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField>
          <Switch
            {...rest}
            id={name}
            label={label}
            description={description}
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
            onBlur={field.onBlur}
          />
          {fieldState.error?.message && (
            <FormError>{fieldState.error.message}</FormError>
          )}
        </FormField>
      )}
    />
  );
}

RhfSwitch.displayName = "RhfSwitch";
