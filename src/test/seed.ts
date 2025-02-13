import { prisma } from "@/lib/prisma";

async function initAttributeValues() {
    await prisma.attribute.create({
        data: {
            name: "Color",
        }
    });
}


async function main() {
    await initAttributeValues();
}

main().then(() => {
    console.log("Seed completed.");
}).catch((error) => {
    console.error("Seed failed:", error);
});