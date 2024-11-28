import { Message } from "openai/resources/beta/threads/messages.mjs";

export type RegisterForm = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export type LoginForm = {
    email: string;
    password: string;
};

export interface AppMessage {
    id: string;
    role: Message["role"];
    text: string;
}
