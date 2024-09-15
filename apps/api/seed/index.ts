import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.map.create({
        data: {
            name: "Test Map",
        },
    });
}

main();
