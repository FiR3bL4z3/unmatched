import { useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { Link } from "react-router-dom";
import { Loading } from "../components/loading";
import { Container } from "../components/container";
import { ListPageHeader } from "../components/list-page-header";
import { ListGrid } from "../components/list-grid";
import { Card } from "../components/card";

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
        <Container>
            <ListPageHeader
                title="Games"
                createLink="/games/create"
                createButtonText="Create new game"
            />

            {isLoading && <Loading />}
            {data && (
                <ListGrid>
                    {data.map((game) => (
                        <Link to={`/games/${game.id}`} key={game.id}>
                            <Card>
                                <h2 className="text-xl font-bold">
                                    {game.createdAt}
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
