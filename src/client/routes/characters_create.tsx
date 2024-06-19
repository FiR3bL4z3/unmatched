import { useState } from "react";
import { client } from "../client";
import { z } from "zod";
import { APIError } from "../utils/api-error";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../components/button-and-link";
import { Input } from "../components/input";
import { Container } from "../components/container";
import { Card } from "../components/card";

const SubmitDataValidator = z.object({
    name: z.string().min(3),
});

type SubmitData = z.infer<typeof SubmitDataValidator>;

const submitData = async (data: SubmitData) => {
    const response = await client.characters.$post({ json: data });

    const json = await response.json();

    if (!json.ok) {
        throw new APIError(json);
    }

    return json.data;
};

export default function Page() {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");

    const navigate = useNavigate();

    const { error, mutateAsync, isPending } = useMutation({
        mutationFn: submitData,
        onSuccess: ({ id }) => {
            navigate(`/characters/${id}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = SubmitDataValidator.safeParse({ name });

        if (!result.success) {
            setNameError(result.error.errors[0].message);
            return;
        }

        mutateAsync(result.data);
    };

    return (
        <Container>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="..."
                        value={name}
                        label="Name"
                        errorMessage={nameError}
                        onChange={(e) => setName(e.target.value)}
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
