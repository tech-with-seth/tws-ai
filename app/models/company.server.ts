import { Company } from "@prisma/client";
import { prisma } from "~/db.server";

export function getCompanyCount() {
    return prisma.company.count();
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
