import { forwardRef } from "react";
import { FormLabel } from "./form-label";
import { FormError } from "./form-error";

export type SelectProps = Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "className"
>;

export const Select = forwardRef(
    (
        { children, ...props }: SelectProps,
        ref: React.Ref<HTMLSelectElement>,
    ) => {
        return (
            <select
                {...props}
                ref={ref}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 block w-full"
            >
                {children}
            </select>
        );
    },
);

export type SelectExtendedProps = {
    label: string;
    errorMessage?: string | undefined;
} & SelectProps;

export const SelectExtended = forwardRef(
    (
        { label, errorMessage, children, ...props }: SelectExtendedProps,
        ref: React.Ref<HTMLSelectElement>,
    ) => {
        return (
            <label className="block py-4">
                <FormLabel>{label}</FormLabel>
                <Select {...props} ref={ref}>
                    {children}
                </Select>
                {errorMessage && <FormError>{errorMessage}</FormError>}
            </label>
        );
    },
);
