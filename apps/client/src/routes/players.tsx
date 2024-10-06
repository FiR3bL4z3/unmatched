import { useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { Link } from "react-router-dom";
import { Loading } from "../components/loading";
import { Container } from "../components/container";
import { ListPageHeader } from "../components/list-page-header";
import { ListGrid } from "../components/list-grid";
import { Card } from "../components/card";

const loadData = async () => {
    const { data: successJson, error: errorJson } =
        await openApiClient.GET("/players");

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
    const { data, isLoading, error } = useQuery({
        queryKey: ["players"],
        queryFn: loadData,
    });
    return (
        <Container>
            <ListPageHeader
                title="Players"
                createLink="/players/create"
                createButtonText="Create new player"
            />

            {isLoading && <Loading />}
            {data && (
                <ListGrid>
                    {data.map((player) => (
                        <Link to={`/players/${player.id}`} key={player.id}>
                            <Card>
                                <h2 className="text-xl font-bold">
                                    {player.name}
                                </h2>
                            </Card>
                        </Link>
                    ))}
                </ListGrid>
            )}
            {error && <QueryError error={error} />}
        </Container>
    );
}
