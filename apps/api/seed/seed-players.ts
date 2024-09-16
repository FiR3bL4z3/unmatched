import { type PrismaClient } from "@prisma/client";

export async function seedPlayers(prisma: PrismaClient) {
    const players = [
        {
            name: "Balázs",
        },
        {
            name: "Máté",
        },
    ];

    for (const playerData of players) {
        const player = await prisma.player.create({
            data: playerData,
        });
        console.log(player);
    }
}
