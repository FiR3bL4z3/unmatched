import { useMutation, useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/loading";
import { DeleteModal } from "../components/delete-modal";
import { StyledButton, StyledLink } from "../components/button-and-link";
import { useModal } from "../providers/modal-provider";

type SubmitData = {
    id: string;
};

const submitData = async (data: SubmitData) => {
    const { data: successJson, error: errorJson } = await openApiClient.DELETE(
        "/players/{id}",
        {
            params: {
                path: {
                    id: data.id,
                },
            },
        },
    );

    if (errorJson || !successJson) {
        throw new APIError(
            errorJson ??
                ({
                    ok: false,
                    path: "",
                    description: "No data",
                } as const),
        );
    }

    return successJson.data;
};

const loadData = async (gameId: string) => {
    const { data: successJson, error: errorJson } = await openApiClient.GET(
        "/players/{id}",
        {
            params: {
                path: {
                    id: gameId,
                },
            },
        },
    );

    if (errorJson || !successJson) {
        throw new APIError(
            errorJson ??
                ({
                    ok: false,
                    path: "",
                    description: "No data",
                } as const),
        );
    }

    return successJson.data;
};

export default function Page() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { close, open } = useModal();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: submitData,
        onSuccess: () => {
            navigate("/players");
            close();
        },
    });

    if (!id) {
        throw navigate("/players");
    }

    if (!id) {
        throw navigate("/characters");
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["players", id],
        queryFn: () => loadData(id),
    });

    return (
        <div>
            <h1>Players</h1>
            {isLoading && <Loading />}
            {data && (
                <>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    <StyledLink to={`/players/${id}/edit`}>Edit</StyledLink>
                    <StyledButton
                        onClick={() =>
                            open(
                                <DeleteModal
                                    entityType="player"
                                    close={close}
                                    onDelete={() => mutateAsync({ id: id })}
                                    pending={isPending}
                                />,
                            )
                        }
                    >
                        Delete
                    </StyledButton>
                </>
            )}
            {error && <QueryError error={error} />}
        </div>
    );
}
