import { useState } from "react";

export const useField = <T>(name: string, defaultValue: T) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);

  return {
    name,
    value,
    setValue: (value: T) => setValue(value),
    error,
    setError: (error: string | undefined) => setError(error),
    touched,
    setTouched: (touched: boolean) => setTouched(touched),
    reset: () => setValue(defaultValue),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Field = ReturnType<typeof useField<any>>;
