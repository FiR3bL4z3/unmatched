import { PropsWithChildren } from "react";

const Decorator = ({ children }: PropsWithChildren) => (
    <div className="w-96 p-5">{children}</div>
);

export default Decorator;
