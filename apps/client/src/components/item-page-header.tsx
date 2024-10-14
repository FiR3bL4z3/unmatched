import { Link } from "react-router-dom";

type EntityType = "game" | "character" | "map" | "player";

export type ItemPageHeaderProps = {
    title: string;
    entityType: EntityType;
};

const entityTypeToTitle = {
    character: "Characters",
    game: "Games",
    map: "Maps",
    player: "Players",
} as const satisfies Record<EntityType, string>;

const entityTypeToPath = {
    character: "/characters",
    game: "/games",
    map: "/maps",
    player: "/players",
} as const satisfies Record<EntityType, string>;

export const ItemPageHeader = ({ title, entityType }: ItemPageHeaderProps) => {
    return (
        <div className="flex justify-between items-center mb-4 p-4">
            <h1 className="text-2xl font-bold">
                <Link to={entityTypeToPath[entityType]}>
                    {entityTypeToTitle[entityType]}
                </Link>{" "}
                / {title}
            </h1>
        </div>
    );
};
