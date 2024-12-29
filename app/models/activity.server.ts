import { ActionType, ActivityLog, User } from "@prisma/client";
import { prisma } from "~/db.server";

export function createLog({
    action,
    userId,
    meta,
}: {
    action: ActionType;
    userId: User["id"];
    meta?: Record<string, any>;
}) {
    return prisma.activityLog.create({
        data: {
            userId,
            action,
            meta,
        },
    });
}
