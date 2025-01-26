import { Company } from "@prisma/client";
import { prisma } from "~/db.server";

export function getCompanyCount() {
    return prisma.company.count();
}

export function getCompanies() {
    return prisma.company.findMany();
}

export function createCompany({
    name,
    description,
}: Pick<Company, "name" | "description">) {
    return prisma.company.create({
        data: {
            name,
            description,
        },
    });
}

export function deleteCompany(id: string) {
    return prisma.company.delete({
        where: { id },
    });
}
