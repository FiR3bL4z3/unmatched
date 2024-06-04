import { useState } from "react";
import { client } from "../client";
import { z } from "zod";
import { APIError } from "../utils/api-error";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../components/button-and-link";

const SubmitDataValidator = z.object({
  name: z.string(),
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
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <p className="text-red-500">{nameError}</p>}
      </label>
      <StyledButton type="submit" disabled={isPending}>
        Submit
      </StyledButton>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}
