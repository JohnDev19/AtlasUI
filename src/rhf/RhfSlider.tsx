"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Slider, FormField, FormLabel, FormError } from "veloria-ui";

export interface RhfSliderProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
}

export function RhfSlider<T extends FieldValues>({
  name,
  control,
  label,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  showValue,
}: RhfSliderProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Radix Slider uses number[], RHF stores a plain number
        const asArray: number[] = Array.isArray(field.value)
          ? field.value
          : [typeof field.value === "number" ? field.value : min];

        return (
          <FormField>
            {label && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium leading-none">{label}</span>
                {showValue && (
                  <span className="text-sm text-muted-foreground">{asArray[0]}</span>
                )}
              </div>
            )}
            <Slider
              value={asArray}
              onValueChange={(val) => field.onChange(val[0])}
              onBlur={field.onBlur}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
            />
            {fieldState.error?.message && (
              <FormError>{fieldState.error.message}</FormError>
            )}
          </FormField>
        );
      }}
    />
  );
}

RhfSlider.displayName = "RhfSlider";
