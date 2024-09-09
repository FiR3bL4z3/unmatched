import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";
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
    const response = await client.characters[":id"].$delete({ param: data });

    const json = await response.json();

    if (!json.ok) {
        throw new APIError(json);
    }

    return json.data;
};

const loadData = async (characterId: string) => {
    const response = await client.characters[":id"].$get({
        param: {
            id: characterId,
        },
    });

    const json = await response.json();

    if (!json.ok) {
        throw new APIError(json);
    }

    return json.data;
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
