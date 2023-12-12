import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(email: string, password: string) {
  const newUser = await prisma.users.create({
    data: {
      email,
      password,
    },
  });

  return newUser;
}

export async function getAllUsers() {
  const users = await prisma.users.findMany();
  return users;
}

export async function getUserById(id: number) {
  const user = await prisma.users.findUnique({
    where: { id },
  });

  return user;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.users.findUnique({
    where: { email},
  });

  return user;
}

export async function updateUser(
  id: number,
  data: { email?: string, password?: string }
) {
  const updatedUser = await prisma.users.update({
    where: { id },
    data,
  });

  return updatedUser;
}

export async function deleteUser(id: number) {
  const deletedUser = await prisma.users.delete({
    where: { id },
  });

  return deletedUser;
}
