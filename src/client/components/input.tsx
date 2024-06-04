export type InputProps = {
  label: string;
  errorMessage?: string | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">;

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-gray-500 mb-2">
      <span className="text-lg">{children}</span>
    </div>
  );
};

const Error = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-red-500 italic">{children}</div>;
};

export const Input = ({ label, errorMessage, ...props }: InputProps) => {
  return (
    <label className="block py-4">
      <Label>{label}</Label>
      <input
        {...props}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 block w-full"
      />
      {errorMessage && <Error>{errorMessage}</Error>}
    </label>
  );
};
