import type { Server } from "./Server";
import type { User } from "./User";

export type Ticket = {
    id: number;
    title: string;
    message: string;
    category: string;
    priority: string;
    status: string;
    userId: number;
    serverId: number;
    server: Server;
    comments: TicketComment[];
    user: User & {avatar: string;}
    createdAt: Date;
}

export type TicketComment = {
    id: number;
    ticketId: number;
    userId: number;
    message: string;
    createdAt: string;
    user: User & {avatar: string;}
};