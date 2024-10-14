import { useMutation, useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { useNavigate, useParams } from "react-router-dom";
import { StyledButton, StyledLink } from "../components/button-and-link";
import { Loading } from "../components/loading";
import { useModal } from "../providers/modal-provider";
import { DeleteModal } from "../components/delete-modal";

type SubmitData = {
    id: string;
};

const submitData = async (data: SubmitData) => {
    const { data: successJson, error: errorJson } = await openApiClient.DELETE(
        "/characters/{id}",
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
        "/characters/{id}",
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
            navigate("/characters");
            close();
        },
    });

    if (!id) {
        throw navigate("/characters");
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["characters", id],
        queryFn: () => loadData(id),
    });

    return (
        <div>
            <h1>Characters</h1>
            {isLoading && <Loading />}
            {data && (
                <>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    <StyledLink to={`/maps/${id}/edit`}>Edit</StyledLink>
                    <StyledButton
                        onClick={() =>
                            open(
                                <DeleteModal
                                    entityType="character"
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
