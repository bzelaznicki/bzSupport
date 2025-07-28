import {
  AbstractSeed,
  ClientPostgreSQL,
  Info,
} from "https://raw.githubusercontent.com/halvardssm/deno-nessie/main/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export default class extends AbstractSeed<ClientPostgreSQL> {
  /** Runs on seed */
  async run(info: Info): Promise<void> {
    const tenantId = crypto.randomUUID();
    const adminId = crypto.randomUUID();
    const customer1Id = crypto.randomUUID();
    const customer2Id = crypto.randomUUID();
    const ticket1Id = crypto.randomUUID();
    const ticket2Id = crypto.randomUUID();
    const ticket3Id = crypto.randomUUID();
    const comment1Id = crypto.randomUUID();

    const adminPassword = await bcrypt.hash("admin123");

    // Insert tenant
    await this.client.queryObject`
            INSERT INTO tenants (id, name, domain, email_alias, ticket_prefix)
            VALUES (${tenantId}, 'ACME Support', 'acme.local', 'acme', 'ACME');
        `;

    // Insert admin user
    await this.client.queryObject`
            INSERT INTO users (id, tenant_id, name, email, role, password_hash)
            VALUES (${adminId}, ${tenantId}, 'Admin User', 'admin@acme.local', 'admin', ${adminPassword});
        `;

    // Insert customers
    await this.client.queryObject`
            INSERT INTO users (id, tenant_id, name, email, role)
            VALUES 
            (${customer1Id}, ${tenantId}, 'John Doe', 'john@customer.com', 'customer'),
            (${customer2Id}, ${tenantId}, 'Jane Roe', 'jane@customer.com', 'customer');
        `;

    // Insert tickets
    await this.client.queryObject`
            INSERT INTO tickets (id, tenant_id, public_id, subject, description, status, created_by)
            VALUES
            (${ticket1Id}, ${tenantId}, 1, 'Cannot log in', 'I am unable to log into my account.', 'open', ${customer1Id}),
            (${ticket2Id}, ${tenantId}, 2, 'Feature request', 'Can you add dark mode?', 'pending', ${customer2Id}),
            (${ticket3Id}, ${tenantId}, 3, 'Bug report', 'The dashboard crashes on iOS.', 'resolved', ${customer1Id});
        `;

    // Add comment
    await this.client.queryObject`
            INSERT INTO ticket_comments (id, tenant_id, ticket_id, created_by, body, is_internal)
            VALUES (${comment1Id}, ${tenantId}, ${ticket1Id}, ${adminId}, 'Looking into this issue.', false);
        `;
  }
}
