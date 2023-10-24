//CLI: node scipts/seed.ts
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
    // Create sample users
    const user1 = await db.user.create({
      data: {
        id: 'ddfghfg',
        email: 'user12@example.com',
        name: 'User One',
      },
    });
  
    const user2 = await db.user.create({
      data: {
        id: 'user_2TqlJnyeV76HYcNWnq36bBTwPlQ',
        email: 'user23@example.com',
        name: 'User Two',
      },
    });
  
    // Create sample folders
    const folder1 = await db.folder.create({
      data: {
        name: 'Folder One',
        user: { connect: { id: user1.id } },
      },
    });
  
    const folder2 = await db.folder.create({
      data: {
        name: 'Folder Two',
        user: { connect: { id: user2.id } },
      },
    });
  
    // Create sample flow instances
// Create sample flow instances
    const flowInstance1 = await db.flowInstance.create({
      data: {
        title: 'Flow Instance One',
        nodes: '{}',
        edges: '{}',
        user: { connect: { id: user1.id } },
        folder: { connect: { folderId: folder1.folderId } }, // Change this line
        folderId: folder1.folderId,
      },
    });

    const flowInstance2 = await db.flowInstance.create({
      data: {
        title: 'Flow Instance Two',
        nodes: '{}',
        edges: '{}',
        user: { connect: { id: user2.id } },
        folder: { connect: { folderId: folder2.folderId } }, // Change this line
        folderId: folder2.folderId,
      },
    });
  
    console.log('Seeding completed');
  }

main()
.catch((e) => {
console.error(e);
process.exit(1);
})
.finally(async () => {
await db.$disconnect();
});

export {}