import { openApiClient } from "../client";
import { z } from "zod";
import { APIError } from "../utils/api-error";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../components/button-and-link";
import { InputExtended } from "../components/input";
import { Container } from "../components/container";
import { Card } from "../components/card";
import { useField } from "../form/use-field";
import { handleSubmit } from "../form/handle-submit";

const SubmitDataValidator = z.object({
    name: z.string().min(3),
});

type SubmitData = z.infer<typeof SubmitDataValidator>;

const submitData = async (data: SubmitData) => {
    const { data: successJson, error: errorJson } = await openApiClient.POST(
        "/players",
        {
            body: data,
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
    const nameField = useField("name", z.string(), "");

    const navigate = useNavigate();

    const { error, mutateAsync, isPending } = useMutation({
        mutationFn: submitData,
        onSuccess: ({ id }) => {
            navigate(`/players/${id}`);
        },
    });

    const onSubmit = handleSubmit([nameField], ({ name }) => {
        mutateAsync({
            name,
        });
    });

    return (
        <Container>
            <Card>
                <form onSubmit={onSubmit}>
                    <InputExtended
                        type="text"
                        placeholder="..."
                        value={nameField.value}
                        label="Name"
                        errorMessage={nameField.error}
                        onChange={(e) => nameField.setValue(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <StyledButton type="submit" disabled={isPending}>
                            Submit
                        </StyledButton>
                    </div>
                    {error && <p className="text-red-500">{error.message}</p>}
                </form>
            </Card>
        </Container>
    );
}
