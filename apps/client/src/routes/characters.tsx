import { useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { Link } from "react-router-dom";
import { ListGrid } from "../components/list-grid";
import { Card } from "../components/card/card";
import { Container } from "../components/container";
import { Loading } from "../components/loading";
import { ListPageHeader } from "../components/list-page-header";

const loadData = async () => {
    const { data: successJson, error: errorJson } =
        await openApiClient.GET("/characters");

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
        queryKey: ["characters"],
        queryFn: loadData,
    });
    return (
        <Container>
            <ListPageHeader
                title="Characters"
                createLink="/characters/create"
                createButtonText="Create new character"
            />

            {isLoading && <Loading />}
            {data && (
                <ListGrid>
                    {data.map((character) => (
                        <Link
                            to={`/characters/${character.id}`}
                            key={character.id}
                        >
                            <Card>
                                <h2 className="text-xl font-bold">
                                    {character.name}
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
