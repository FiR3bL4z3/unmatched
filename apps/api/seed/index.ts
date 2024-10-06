import { prisma } from "./client";
import { seedCharacters } from "./seed-characters";
import { seedMaps } from "./seed-maps";
import { seedPlayers } from "./seed-players";

async function main() {
    console.log("Seeding database...");

    await seedMaps(prisma);
    await seedCharacters(prisma);
    await seedPlayers(prisma);
}

main();
