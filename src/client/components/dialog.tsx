export type DialogProps = {
    children?: React.ReactNode;
    onClose?: () => void;
};

export const Dialog = ({ children, onClose }: DialogProps) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={(event) => {
                if (event.target === event.currentTarget && onClose) {
                    onClose();
                }
            }}
        >
            <div className="bg-white p-4 rounded-lg">{children}</div>
        </div>
    );
};
