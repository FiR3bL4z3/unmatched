import { APIError } from "../utils/api-error";

export type QueryErrorProps = {
    error: Error;
};

export const QueryError = ({ error }: QueryErrorProps) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h1 className="text-xl font-bold">Query Error</h1>
            {error instanceof APIError && (
                <div className="mt-4">
                    <span className="font-bold">Message:</span>
                    <span className="ml-2">{error.message}</span>
                    <br />
                    <span className="font-bold">Path:</span>
                    <span className="ml-2">{error.info.path}</span>
                    <br />
                    <span className="font-bold">Description:</span>
                    <span className="ml-2">{error.info.description}</span>
                </div>
            )}
        </div>
    );
};
