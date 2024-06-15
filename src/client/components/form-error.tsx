export type FormErrorProps = {
  children: React.ReactNode;
};

export const FormError = ({ children }: FormErrorProps) => {
  return <div className="text-red-500 italic">{children}</div>;
};
