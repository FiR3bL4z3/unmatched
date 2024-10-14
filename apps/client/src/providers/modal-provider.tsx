import { createContext, PropsWithChildren, useContext, useState } from "react";

type ModalContextType = {
    open: (modal: React.ReactNode) => void;
    close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: PropsWithChildren) => {
    const [modal, setModal] = useState<React.ReactNode | null>(null);

    const contextValue = {
        open: (modal: React.ReactNode) => {
            setModal(modal);
        },
        close: () => {
            setModal(null);
        },
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {modal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            contextValue.close();
                        }
                    }}
                >
                    {modal}
                </div>
            )}
        </ModalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
