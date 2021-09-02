import prisma from '../lib/prisma';

async function main() {
  const taihei = await prisma.user.create({
    data: {
      email: 'taihei@email.com',
      name: '太平',
      notes: {
        create: {
          title: "太平のノート",
          items: {
            create: {
              body: '太平の最初のアイテム',
            },
          },
        },
      },
    },
  });

  const megumi = await prisma.user.create({
    data: {
      email: 'megumi@email.com',
      name: '恵',
      notes: {
        create: {
          title: "恵のノート",
          items: {
            create: {
              body: '恵の最初のアイテム',
            },
          },
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
