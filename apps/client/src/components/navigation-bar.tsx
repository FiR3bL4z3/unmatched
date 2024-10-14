import { StyledLink } from "./button-and-link/button-and-link";

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
                        <StyledLink to={link.href}>{link.label}</StyledLink>
                    </div>
                ))}
                <div>
                    {!userId && <StyledLink to="/login">Login</StyledLink>}
                </div>
            </div>
        </nav>
    );
};
