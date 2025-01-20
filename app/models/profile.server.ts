import { Profile } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createProfileForUser(
    data: Pick<Profile, "userId" | "firstName" | "lastName">,
): Promise<Profile> {
    return prisma.profile.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            userId: data.userId,
        },
    });
}

export async function getProfileById(id: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
        where: { id },
    });
}

export async function updateProfile(
    id: string,
    data: Partial<Profile>,
): Promise<Profile> {
    return prisma.profile.update({
        where: { id },
        data,
    });
}

export async function deleteProfile(id: string): Promise<Profile> {
    return prisma.profile.delete({
        where: { id },
    });
}
