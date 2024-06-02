import { useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { Link } from "react-router-dom";

const loadData = async () => {
  const response = await client.players.$get();

  const json = await response.json();

  if (!json.ok) {
    throw new APIError(json);
  }

  return json.data;
};

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["players"],
    queryFn: loadData,
  });
  return (
    <div>
      <h1>Players</h1>
      {isLoading && <p>Loading...</p>}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {data.map((player) => (
            <Link
              to={`/players/${player.id}`}
              key={player.id}
              className="border p-4 rounded-md shadow-md"
            >
              <h2 className="text-xl font-bold">{player.name}</h2>
            </Link>
          ))}
        </div>
      )}
      {error && <QueryError error={error} />}
    </div>
  );
}
