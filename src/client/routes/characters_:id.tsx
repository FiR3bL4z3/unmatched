import { useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { redirect, useParams } from "react-router-dom";

const fetchCharacter = async (characterId: string) => {
  const response = await client.characters[":id"].$get({
    param: {
      //   id: "clwwhee5x00004iqpikike0na",
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

  if (!id) {
    throw redirect("/characters");
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["characters", id],
    queryFn: () => fetchCharacter(id),
  });

  return (
    <div>
      <h1>Characters</h1>
      {isLoading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <QueryError error={error} />}
    </div>
  );
}
