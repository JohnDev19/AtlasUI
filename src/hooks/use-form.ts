import * as React from "react";
export interface UseFormOptions<T> { initialValues: T; validate?: (v: T) => Partial<Record<keyof T, string>>; }
export interface UseFormReturn<T> { values: T; errors: Partial<Record<keyof T,string>>; touched: Partial<Record<keyof T,boolean>>; handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void; handleBlur: (field: keyof T) => () => void; setFieldValue: (field: keyof T, value: T[keyof T]) => void; reset: () => void; isValid: boolean; }
export function useForm<T extends object>({ initialValues, validate }: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T,string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T,boolean>>>({});
  const runValidate = React.useCallback((v: T) => validate ? validate(v) : {}, [validate]);
  const handleChange = (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next); setErrors(runValidate(next));
  };
  const handleBlur = (field: keyof T) => () => setTouched(t => ({ ...t, [field]: true }));
  const setFieldValue = (field: keyof T, value: T[keyof T]) => { const next = { ...values, [field]: value }; setValues(next); setErrors(runValidate(next)); };
  const reset = () => { setValues(initialValues); setErrors({}); setTouched({}); };
  const isValid = Object.keys(runValidate(values)).length === 0;
  return { values, errors, touched, handleChange, handleBlur, setFieldValue, reset, isValid };
}
