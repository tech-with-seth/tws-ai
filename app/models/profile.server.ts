import { Profile } from "@prisma/client";
import { prisma } from "~/db.server";

export function getProfileCount() {
    return prisma.profile.count();
}

export function getProfiles() {
    return prisma.profile.findMany();
}

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

export async function upsertProfileForUser(
    data: Pick<Profile, "firstName" | "lastName"> & { userId: string },
): Promise<Profile> {
    return prisma.profile.upsert({
        where: { userId: data.userId },
        update: {
            firstName: data.firstName,
            lastName: data.lastName,
        },
        create: {
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

export async function getProfileByUserId(
    userId: string,
): Promise<Profile | null> {
    return prisma.profile.findUnique({
        where: { userId },
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

export async function updateProfileByUserId(
    id: string,
    data: Partial<Profile>,
): Promise<Profile> {
    return prisma.profile.update({
        where: { userId: id },
        data,
    });
}

export async function deleteProfile(id: string): Promise<Profile> {
    return prisma.profile.delete({
        where: { id },
    });
}

export async function deleteProfileByUserId(id: string): Promise<Profile> {
    return prisma.profile.delete({
        where: { userId: id },
    });
}
