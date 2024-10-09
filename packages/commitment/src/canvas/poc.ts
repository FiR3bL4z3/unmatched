import { sleep } from "bun";

// Listen for the 'resize' event on process.stdout
process.stdout.on("resize", () => {
    const width = process.stdout.columns;
    const height = process.stdout.rows;
    console.log(`Terminal resized to: ${width}x${height}`);
});

const initialCanvas = [
    "          ",
    "          ",
    "          ",
    "          ",
    "          ",
];

// Print canvas
initialCanvas.forEach((row) => {
    console.log(row);
});

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
        // copy canvas
        const canvas = [...initialCanvas];
        canvas[i] =
            canvas[i].substring(0, j) + "X" + canvas[i].substring(j + 1);
        await sleep(500);
        // move up 5 rows
        process.stdout.write("\x1b[5A");
        // move left 3 columns
        process.stdout.write("\x1b[10D");
        canvas.forEach((row) => {
            console.log(row);
        });
    }
}
