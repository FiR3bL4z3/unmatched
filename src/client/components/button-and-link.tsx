import { Link, LinkProps } from "react-router-dom";

export type StyledButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
>;

export const StyledButton = ({ children, ...props }: StyledButtonProps) => {
  return (
    <button
      {...props}
      className="text-white hover:text-gray-300 px-4 py-2 rounded-md bg-gray-700 block w-fit"
    >
      {children}
    </button>
  );
};

export type StyledLinkProps = Omit<LinkProps, "className">;

export const StyledLink = ({ children, ...props }: StyledLinkProps) => {
  return (
    <Link
      {...props}
      className="text-white hover:text-gray-300 px-4 py-2 rounded-md bg-gray-700 block w-fit"
    >
      {children}
    </Link>
  );
};
