import { prisma } from "~/db.server";

export function createArticle(
    title: string,
    content: string,
    sanityId: string,
) {
    return prisma.article.create({
        data: {
            title,
            content,
            sanityId,
        },
    });
}

export function upsertArticle(
    sanityId: string,
    title: string,
    content: string,
) {
    return prisma.article.upsert({
        where: {
            sanityId,
        },
        create: {
            title,
            content,
            sanityId,
        },
        update: {
            title,
            content,
        },
    });
}

export function getArticles() {
    return prisma.article.findMany();
}
