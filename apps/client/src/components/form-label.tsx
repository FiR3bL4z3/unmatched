export type FormLabelProps = {
    children: React.ReactNode;
};

export const FormLabel = ({ children }: FormLabelProps) => {
    return (
        <div className="text-gray-500 mb-2">
            <span className="text-lg">{children}</span>
        </div>
    );
};
