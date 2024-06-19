import { ZodType } from "zod";
import { Field } from "./use-field";

export const handleSubmit = <T>(
  data: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<T, any>,
  fields: Field[],
  onSubmit: (data: T) => void
) => {
  return (e: React.FormEvent) => {
    e.preventDefault();
    const parsedData = schema.safeParse(data);

    if (parsedData.success) {
      fields.forEach((field) => {
        field.setError(undefined);
      });

      onSubmit(parsedData.data);
      return;
    }

    parsedData.error.errors.forEach((error) => {
      console.log(error);
      const field = fields.find((field) =>
        error.path.join(".").includes(field.name)
      );

      if (field) {
        field.setError(error.message);
      }
    });
  };
};
