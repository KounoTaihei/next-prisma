import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const taihei = await prisma.user.create({
    data: {
      email: 'taihei@email.com',
      name: 'Kouno Taihei',
      password: 'taihei',
      threads: {
        create: {
          title: "this is a taihei's thread",
          posts: {
            create: {
              title: '太平の最初の投稿',
              body: '太平の最初の投稿の本文',
            },
          },
        },
      },
    },
  });

  const megumi = await prisma.user.create({
    data: {
      email: 'megumi@email.com',
      name: 'Kouno megumi',
      password: 'megumi',
      threads: {
        create: {
          title: "this is a megumi's thread",
          posts: {
            create: {
              title: '恵の最初の投稿',
              body: '恵の最初の投稿の本文',
            },
          },
        },
      },
    },
  });
  console.log(taihei, megumi);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
