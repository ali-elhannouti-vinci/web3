const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function createUsersAndGetTheirIds() {
  const newUsers = [
    {name: "Kratos",email: "Kratos@gmail.com"},
    {name: "Freddy Fazbear",email: "freddyfazbear@gmail.com"},
    {name: "Walter White",email: "walterwhite@gmail.com"}
  ];
  const newEmails = newUsers.map(u => u.email);

  // 1. Création des utilisateurs (ne retourne pas les IDs)
  await prisma.user.createMany({
    data: newUsers,
    skipDuplicates: true,
  });

  // 2. Récupération des IDs des utilisateurs qui viennent d'être insérés
  const createdUsers = await prisma.user.findMany({
    where: {
      email: {
        in: newEmails, // Filtrer sur les emails que vous venez d'utiliser
      },
    },
    select: {
      id: true, // Sélectionner uniquement l'ID
    },
  });

  // createdUsers est un tableau de { id: X, email: Y }
  const createdUsersIds = createdUsers.map(u => u.id);
  console.log("IDs créés :", createdUsersIds); // Affiche par exemple : IDs créés : [2, 3]

  return createdUsersIds;
}

async function main() {
  const newUsersIds = await createUsersAndGetTheirIds();
  const [kratosUserId, freddyUserId, walterUserId] = newUsersIds;

  const transfers = await prisma.transfer.createMany({
    data: [
      { amount: 0.5, sourceId: kratosUserId, targetId: freddyUserId },
      { amount: 1.25, sourceId: freddyUserId, targetId: walterUserId },
      { amount: 0.75, sourceId: walterUserId, targetId: kratosUserId },
    ],
    skipDuplicates: true, // Skip duplicates based on unique constraints
  });

  const expenses = await prisma.expense.createMany({
    data: [
      { description: 'Pizza', amount: 0.5, payerId: kratosUserId,participants : {connect :[{id : kratosUserId}] }},
      { description: 'Boissons', amount: 1.0, payerId: freddyUserId ,participants : {connect :[{id : freddyUserId}] }},
      { description: 'Sushis', amount: 2.0, payerId: walterUserId, participants : {connect :[{id : walterUserId}] }},
    ],
    skipDuplicates: true, // Skip duplicates based on unique constraints
  });

  console.log('transfers:', transfers);
  console.log('expenses:', expenses);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
