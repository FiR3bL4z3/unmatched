import { type PrismaClient } from "@prisma/client";

export const seedCharacters = async (prisma: PrismaClient) => {
    const characters = [
        {
            name: "Beowulf",
        },
        {
            name: "Sherlock Holmes",
        },
        {
            name: "Bloody Mary",
        },
    ];

    for (const characterData of characters) {
        const character = await prisma.character.create({
            data: characterData,
        });
        console.log(character);
    }
};
