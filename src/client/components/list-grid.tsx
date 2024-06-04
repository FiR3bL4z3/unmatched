export type ListGridProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className"
>;

export const ListGrid = ({ children, ...props }: ListGridProps) => {
  return (
    <div
      {...props}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {children}
    </div>
  );
};
