import { type PrismaClient } from "@prisma/client";

export async function seedMaps(prisma: PrismaClient) {
    const maps = [
        {
            name: "Yukon",
        },
        {
            name: "Hanging Gardens",
        },
        {
            name: "Sherwood Forest",
        },
    ];

    for (const mapData of maps) {
        const map = await prisma.map.create({
            data: mapData,
        });
        console.log(map);
    }
}
