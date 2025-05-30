import bcrypt from "bcryptjs";
import type { RegisterForm } from "~/utils/types.server";
import { prisma } from "../db.server";
import { Password, Role, User } from "@prisma/client";

export function getUserCount() {
    return prisma.user.count();
}

export const createUser = async (user: RegisterForm) => {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: {
                create: {
                    hash: passwordHash,
                },
            },
            profile: {
                create: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
        },
    });

    return { id: newUser.id, email: user.email };
};

export function getUsers() {
    return prisma.user.findMany();
}

export function getUsersWithRole(role: Role) {
    return prisma.user.findMany({
        where: {
            role,
        },
    });
}

export async function verifyLogin(
    email: User["email"],
    password: Password["hash"],
) {
    const userWithPassword = await prisma.user.findUnique({
        where: { email },
        include: {
            password: true,
        },
    });

    if (!userWithPassword || !userWithPassword.password) {
        return null;
    }

    const isValid = await bcrypt.compare(
        password,
        userWithPassword.password.hash,
    );

    if (!isValid) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userWithPassword;

    return userWithoutPassword;
}

export function deleteUser(id: string) {
    return prisma.user.delete({
        where: {
            id,
        },
    });
}
