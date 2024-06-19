/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prettify } from "hono/utils/types";
import { Field } from "./use-field";

export type FieldReturnsObject<
  Tuple extends readonly Field<any, any, string>[],
> = {
  [Key in Tuple[number]["name"]]: Extract<
    Tuple[number],
    { name: Key }
  > extends Field<any, infer Validated, any>
    ? Validated
    : never;
};

export const handleSubmit = <
  FieldTuple extends readonly Field<any, any, string>[],
>(
  fields: FieldTuple,
  onSubmit: (data: Prettify<FieldReturnsObject<FieldTuple>>) => void
) => {
  return (e: React.FormEvent) => {
    e.preventDefault();

    const result: FieldReturnsObject<FieldTuple> = {} as any;

    let isValid = true;
    for (const field of fields) {
      const validationResult = field.validate();

      if (validationResult.isOk()) {
        result[field.name as keyof typeof result] = validationResult.value;
      } else {
        field.setError(validationResult.error);
        isValid = false;
      }
    }

    if (isValid) {
      onSubmit(result);
    }
  };
};
