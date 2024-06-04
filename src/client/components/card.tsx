export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "className">;

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <div {...props} className="border p-4 rounded-md shadow-md">
      {children}
    </div>
  );
};
