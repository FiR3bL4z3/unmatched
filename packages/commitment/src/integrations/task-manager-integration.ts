export type Task = {
    id: string;
    title: string;
    project: string;
    description?: string;
};

export type AsyncError = {
    message: string;
};

type CreateTaskInput = {
    name: string;
    project: string;
    description: string;
};

export type GetTasksByProjectResult = Promise<
    { ok: true; tasks: Task[] } | { ok: false; error: AsyncError }
>;

export type TaskManagerIntegration = {
    getTasksByProject: (project: string) => GetTasksByProjectResult;

    // createTask: (task: CreateTaskInput) => ResultAsync<Task, Error>;
    // updateTask: (task: Task) => ResultAsync<Task, Error>;
};

export type TaskManagerFactory<T extends unknown[]> = (
    ...args: T
) => TaskManagerIntegration;

export function createTaskManagerIntegration<T extends unknown[]>(
    factory: TaskManagerFactory<T>,
): TaskManagerFactory<T> {
    return factory;
}
