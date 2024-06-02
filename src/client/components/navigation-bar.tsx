import { Link } from "react-router-dom";

export type NavigationBarProps = {
  userId?: string | undefined;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/players", label: "Players" },
  { href: "/maps", label: "Maps" },
  { href: "/characters", label: "Characters" },
  { href: "/games", label: "Games" },
];

export const NavigationBar = ({ userId }: NavigationBarProps) => {
  return (
    <nav className="bg-gray-800 p-2">
      <div className="flex justify-center space-x-4">
        {links.map((link, idx) => (
          <div key={idx}>
            <Link
              to={link.href}
              className="text-white hover:text-gray-300 px-4 py-2 rounded-md bg-gray-700 block"
            >
              {link.label}
            </Link>
          </div>
        ))}
        <div>
          {!userId && (
            <Link
              to="/login"
              className="text-white hover:text-gray-300 px-4 py-2 rounded-md bg-gray-700 block"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
