import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export const Loading = () => {
    const x = useSpring(0, { stiffness: 400, damping: 20, duration: 0.5 });
    const y = useSpring(0, { stiffness: 400, damping: 20, duration: 0.5 });
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (step === 0) {
                x.set(50);
                y.set(0);
            }
            if (step === 1) {
                x.set(50);
                y.set(50);
            }
            if (step === 2) {
                x.set(0);
                y.set(50);
            }
            if (step === 3) {
                x.set(0);
                y.set(0);
            }
            setStep((prev) => (prev + 1) % 4);
        }, 500);

        return () => clearInterval(interval);
    }, [x, step, y]);

    return (
        <motion.div
            className="bg-red-400 w-10 h-10 rounded-md"
            style={{ x, y }}
        />
    );
};
