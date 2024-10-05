import { useMutation, useQuery } from "@tanstack/react-query";
import { openApiClient } from "../client";
import { APIError } from "../utils/api-error";

const loadData = async () => {
    const response = await openApiClient.GET("/players");

    const json = response.data!;

    if (!json.ok) {
        throw new APIError(json);
    }

    return json.data;
};

const submitData = async () => {
    const response = await openApiClient.POST("/players", {
        body: {
            name: "Jani",
        },
    });

    return response.data;
};

export default function Page() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["players"],
        queryFn: loadData,
    });
    const { mutate } = useMutation({
        mutationFn: submitData,
        onSuccess: () => {
            refetch();
        },
    });

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mt-8">
                Welcome to the Unmatched history app!
            </h1>
            <p className="text-lg text-center mt-4">
                This is the home page of the app.
            </p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
                onClick={() => mutate()}
            >
                Create player
            </button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
