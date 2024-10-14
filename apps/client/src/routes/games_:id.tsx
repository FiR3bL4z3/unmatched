import { useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";
import { QueryError } from "../components/query-error";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/loading";
import { Container } from "../components/container";
import { ItemPageHeader } from "../components/item-page-header";
import { Card } from "../components/card/card";

const loadData = async (gameId: string) => {
    const { data: successJson, error: errorJson } = await openApiClient.GET(
        "/games/{id}",
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
        queryKey: ["games", id],
        queryFn: () => loadData(id),
    });

    return (
        <Container>
            <ItemPageHeader title={data?.id ?? ""} entityType="game" />
            {isLoading && <Loading />}
            {data && (
                <Card>
                    <h2 className="text-xl font-bold">{data.date}</h2>
                    <p>
                        {data.player1.name} vs {data.player2.name}
                    </p>
                    <p>
                        {data.character1.name} vs {data.character2.name}
                    </p>
                    <p>
                        Winner:{" "}
                        {data.winner === 1
                            ? data.player1.name
                            : data.player2.name}
                    </p>
                </Card>
            )}
            {error && <QueryError error={error} />}
        </Container>
    );
}
