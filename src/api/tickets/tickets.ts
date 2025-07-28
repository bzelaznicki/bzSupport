import { sql } from "@db/db.ts";
import {
  createTicket as dbCreateTicket,
  getNextTicketNumber,
  listTickets as dbListTickets,
} from "@db/sqlc/tickets_sql.ts";
import { assertUUID } from "@utils/validators.ts";

export async function listTickets(tenantId: string) {
  return await dbListTickets(sql, { tenantId });
}

export async function createTicket(
  tenantId: string,
  data: { subject: string; description?: string; createdBy: string },
) {
  assertUUID(data.createdBy, "createdBy");

  const next = await getNextTicketNumber(sql, { tenantId });
  return await dbCreateTicket(sql, {
    id: crypto.randomUUID(),
    tenantId,
    publicId: next?.nextNumber ?? "1",
    subject: data.subject,
    description: data.description ?? null,
    status: "open",
    createdBy: data.createdBy,
  });
}