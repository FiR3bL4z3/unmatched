import { useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { Link } from "react-router-dom";

const loadData = async () => {
  const response = await client.games.$get();

  const json = await response.json();

  if (!json.ok) {
    throw new APIError(json);
  }

  return json.data;
};

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["games"],
    queryFn: loadData,
  });
  return (
    <div>
      <h1>Games</h1>
      {isLoading && <p>Loading...</p>}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {data.map((game) => (
            <Link
              to={`/games/${game.id}`}
              key={game.id}
              className="border p-4 rounded-md shadow-md"
            >
              <h2 className="text-xl font-bold">{game.createdAt}</h2>
            </Link>
          ))}
        </div>
      )}
      {error && <QueryError error={error} />}
    </div>
  );
}
