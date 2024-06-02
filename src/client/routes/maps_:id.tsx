import { useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { redirect, useParams } from "react-router-dom";

const loadData = async (mapId: string) => {
  const response = await client.maps[":id"].$get({
    param: {
      id: mapId,
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
    throw redirect("/maps");
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["maps", id],
    queryFn: () => loadData(id),
  });

  return (
    <div>
      <h1>Maps</h1>
      {isLoading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <QueryError error={error} />}
    </div>
  );
}
