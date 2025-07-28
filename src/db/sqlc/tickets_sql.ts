import { Sql } from "postgres";

export const getNextTicketNumberQuery = `-- name: GetNextTicketNumber :one
SELECT COALESCE(MAX(public_id), 0) + 1 AS next_number
FROM tickets
WHERE tenant_id = $1`;

export interface GetNextTicketNumberArgs {
    tenantId: string;
}

export interface GetNextTicketNumberRow {
    nextNumber: string;
}

export async function getNextTicketNumber(sql: Sql, args: GetNextTicketNumberArgs): Promise<GetNextTicketNumberRow | null> {
    const rows = await sql.unsafe(getNextTicketNumberQuery, [args.tenantId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        nextNumber: row[0]
    };
}

export const createTicketQuery = `-- name: CreateTicket :one
INSERT INTO tickets (id, tenant_id, public_id, subject, description, status, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, tenant_id, public_id, subject, description, status, priority, created_by, assigned_to, created_at, updated_at`;

export interface CreateTicketArgs {
    id: string;
    tenantId: string;
    publicId: string;
    subject: string;
    description: string | null;
    status: string | null;
    createdBy: string | null;
}

export interface CreateTicketRow {
    id: string;
    tenantId: string;
    publicId: string;
    subject: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    createdBy: string | null;
    assignedTo: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function createTicket(sql: Sql, args: CreateTicketArgs): Promise<CreateTicketRow | null> {
    const rows = await sql.unsafe(createTicketQuery, [args.id, args.tenantId, args.publicId, args.subject, args.description, args.status, args.createdBy]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        tenantId: row[1],
        publicId: row[2],
        subject: row[3],
        description: row[4],
        status: row[5],
        priority: row[6],
        createdBy: row[7],
        assignedTo: row[8],
        createdAt: row[9],
        updatedAt: row[10]
    };
}

export const listTicketsQuery = `-- name: ListTickets :many
SELECT id, tenant_id, public_id, subject, description, status, priority, created_by, assigned_to, created_at, updated_at FROM tickets
WHERE tenant_id = $1
ORDER BY created_at DESC`;

export interface ListTicketsArgs {
    tenantId: string;
}

export interface ListTicketsRow {
    id: string;
    tenantId: string;
    publicId: string;
    subject: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    createdBy: string | null;
    assignedTo: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function listTickets(sql: Sql, args: ListTicketsArgs): Promise<ListTicketsRow[]> {
    return (await sql.unsafe(listTicketsQuery, [args.tenantId]).values()).map(row => ({
        id: row[0],
        tenantId: row[1],
        publicId: row[2],
        subject: row[3],
        description: row[4],
        status: row[5],
        priority: row[6],
        createdBy: row[7],
        assignedTo: row[8],
        createdAt: row[9],
        updatedAt: row[10]
    }));
}

export const getTicketQuery = `-- name: GetTicket :one
SELECT id, tenant_id, public_id, subject, description, status, priority, created_by, assigned_to, created_at, updated_at FROM tickets
WHERE tenant_id = $1 AND id = $2`;

export interface GetTicketArgs {
    tenantId: string;
    id: string;
}

export interface GetTicketRow {
    id: string;
    tenantId: string;
    publicId: string;
    subject: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    createdBy: string | null;
    assignedTo: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getTicket(sql: Sql, args: GetTicketArgs): Promise<GetTicketRow | null> {
    const rows = await sql.unsafe(getTicketQuery, [args.tenantId, args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        tenantId: row[1],
        publicId: row[2],
        subject: row[3],
        description: row[4],
        status: row[5],
        priority: row[6],
        createdBy: row[7],
        assignedTo: row[8],
        createdAt: row[9],
        updatedAt: row[10]
    };
}

