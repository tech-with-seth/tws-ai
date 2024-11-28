import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function getOrCreateUser(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (user) {
        return user;
    }

    const created = await prisma.user.create({
        data: {
            email,
            password: {
                create: {
                    hash: await bcrypt.hash('asdfasdfasdf', 10)
                }
            },
            profile: {
                create: {
                    firstName: 'Seth',
                    lastName: 'Davis'
                }
            }
        }
    });

    return created;
}

async function seed() {
    await getOrCreateUser('seth@mail.com');
}

try {
    await seed();
} catch (error) {
    console.error(error);
    process.exit(1);
} finally {
    await prisma.$disconnect();
}
