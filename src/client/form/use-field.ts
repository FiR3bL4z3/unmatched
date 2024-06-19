/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result, err, ok } from "neverthrow";
import { useState } from "react";
import { ZodType } from "zod";

export const useField = <DefaultValue, Validated, Name extends string>(
    name: Name,
    validator: ZodType<Validated, any>,
    defaultValue: DefaultValue,
) => {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string>();
    const [touched, setTouched] = useState(false);

    return {
        name,
        value,
        setValue: (value: DefaultValue) => setValue(value),
        error,
        setError: (error: string | undefined) => setError(error),
        touched,
        setTouched: (touched: boolean) => setTouched(touched),
        reset: () => setValue(defaultValue),
        validate: (): Result<Validated, string> => {
            const result = validator.safeParse(value);

            if (result.success) {
                setError(undefined);
                return ok(result.data);
            }

            setError(result.error.errors[0].message);
            return err(result.error.errors[0].message);
        },
    };
};

export type Field<
    DefaultValue = any,
    Validated = any,
    Name extends string = string,
> = ReturnType<typeof useField<DefaultValue, Validated, Name>>;
