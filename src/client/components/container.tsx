export type ContainerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className"
>;

export const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <div {...props} className="w-full lg:w-[800px] mx-auto p-4">
      {children}
    </div>
  );
};
