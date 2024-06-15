import { forwardRef } from "react";
import { FormError } from "./form-error";
import { FormLabel } from "./form-label";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
>;

export const Input = forwardRef(
  (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    return (
      <input
        {...props}
        ref={ref}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 block w-full"
      />
    );
  }
);

export type InputExtendedProps = {
  label: string;
  errorMessage?: string | undefined;
} & InputProps;

export const InputExtended = forwardRef(
  (
    { label, errorMessage, ...props }: InputExtendedProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <label className="block py-4">
        <FormLabel>{label}</FormLabel>
        <input
          {...props}
          ref={ref}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 block w-full"
        />
        {errorMessage && <FormError>{errorMessage}</FormError>}
      </label>
    );
  }
);
