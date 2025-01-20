import { Account } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createAccount(data: Account): Promise<Account> {
    return prisma.account.create({
        data,
    });
}

export async function getAccountById(id: string): Promise<Account | null> {
    return prisma.account.findUnique({
        where: { id },
    });
}

export async function updateAccount(
    id: string,
    data: Partial<Account>,
): Promise<Account> {
    return prisma.account.update({
        where: { id },
        data,
    });
}

export async function deleteAccount(id: string): Promise<Account> {
    return prisma.account.delete({
        where: { id },
    });
}
