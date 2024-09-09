import { useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/loading";

const loadData = async (gameId: string) => {
    const response = await client.games[":id"].$get({
        param: {
            id: gameId,
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

    if (!id) {
        throw navigate("/characters");
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["games", id],
        queryFn: () => loadData(id),
    });

    return (
        <div>
            <h1>Games</h1>
            {isLoading && <Loading />}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            {error && <QueryError error={error} />}
        </div>
    );
}
