import { StyledButton } from "./button-and-link";

type EntityType = "character" | "map" | "player" | "game";

export type DeleteModalProps = {
    close: () => void;
    onDelete: () => void;
    pending: boolean;
    entityType: EntityType;
};

const entityNames: Record<EntityType, string> = {
    character: "character",
    map: "map",
    player: "player",
    game: "game",
};

export const DeleteModal = ({
    close,
    onDelete,
    pending,
    entityType,
}: DeleteModalProps) => {
    return (
        <div className="bg-white p-4 rounded-lg">
            <h1 className="text-xl font-bold">
                Delete {entityNames[entityType]}
            </h1>
            <p>
                Are you sure you want to delete this {entityNames[entityType]}?
            </p>
            <div className="flex justify-end gap-4 mt-2">
                <StyledButton onClick={close}>Cancel</StyledButton>
                <StyledButton onClick={onDelete} disabled={pending}>
                    Delete
                </StyledButton>
            </div>
        </div>
    );
};
