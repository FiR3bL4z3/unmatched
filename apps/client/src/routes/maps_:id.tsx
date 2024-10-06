import { useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/loading";

const loadData = async (gameId: string) => {
    const { data: successJson, error: errorJson } = await openApiClient.GET(
        "/maps/{id}",
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

    if (!id) {
        throw navigate("/characters");
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["maps", id],
        queryFn: () => loadData(id),
    });

    return (
        <div>
            <h1>Maps</h1>
            {isLoading && <Loading />}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            {error && <QueryError error={error} />}
        </div>
    );
}
