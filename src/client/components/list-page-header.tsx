import { StyledLink } from "./button-and-link";

export type ListPageHeaderProps = {
    title: string;
    createLink: string;
    createButtonText: string;
};

export const ListPageHeader = ({
    title,
    createLink,
    createButtonText,
}: ListPageHeaderProps) => {
    return (
        <div className="flex justify-between items-center mb-4 p-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <StyledLink to={createLink}>{createButtonText}</StyledLink>
        </div>
    );
};
