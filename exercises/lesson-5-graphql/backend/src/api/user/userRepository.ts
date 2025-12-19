import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      paidExpenses: true,
      transfersOut: true,
      transfersIn: true,
      participatedExpenses: true,
    },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      paidExpenses: true,
      transfersOut: true,
      transfersIn: true,
      participatedExpenses: true,
    },
  });
}
export async function createUser({
  name,
  email,
  bankAccount,
}: {
  name: string;
  email: string;
  bankAccount? : string | null;
}) {
  return prisma.user.create({
    data: {
      name,
      email,
      bankAccount,
    },
  });
}
