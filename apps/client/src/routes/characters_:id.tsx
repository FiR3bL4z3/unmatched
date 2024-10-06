import { useMutation, useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { useNavigate, useParams } from "react-router-dom";
import { StyledButton, StyledLink } from "../components/button-and-link";
import { Dialog } from "../components/dialog";
import { useState } from "react";
import { Loading } from "../components/loading";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: submitData,
        onSuccess: () => {
            navigate("/characters");
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
                    <StyledButton onClick={() => setIsDialogOpen(true)}>
                        Delete
                    </StyledButton>
                    {isDialogOpen && (
                        <Dialog onClose={() => setIsDialogOpen(false)}>
                            <h1 className="text-xl font-bold">
                                Delete character
                            </h1>
                            <p>
                                Are you sure you want to delete this character?
                            </p>
                            <div className="flex justify-end gap-4 mt-2">
                                <StyledButton
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </StyledButton>
                                <StyledButton
                                    onClick={() =>
                                        mutateAsync({
                                            id,
                                        })
                                    }
                                    disabled={isPending}
                                >
                                    Delete
                                </StyledButton>
                            </div>
                        </Dialog>
                    )}
                </>
            )}
            {error && <QueryError error={error} />}
        </div>
    );
}
