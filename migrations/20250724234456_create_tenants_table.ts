import {
    AbstractMigration,
    Info,
    ClientPostgreSQL,
} from "https://deno.land/x/nessie@2.0.11/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryArray(`
            CREATE TABLE tenants (
                id UUID PRIMARY KEY,
                name TEXT NOT NULL,
                domain TEXT UNIQUE,
                email_alias TEXT UNIQUE,
                ticket_prefix TEXT DEFAULT 'TCK',
                plan TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE users (
                id UUID PRIMARY KEY,
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                name TEXT,
                email TEXT NOT NULL,
                role TEXT CHECK (role IN ('customer','agent','admin')) NOT NULL DEFAULT 'customer',
                password_hash TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE (tenant_id, email)
            );

            CREATE TABLE tickets (
                id UUID PRIMARY KEY,
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                public_id BIGINT NOT NULL,
                subject TEXT NOT NULL,
                description TEXT,
                status TEXT CHECK (status IN ('open','pending','resolved','closed')) DEFAULT 'open',
                priority TEXT CHECK (priority IN ('low','medium','high','urgent')) DEFAULT 'medium',
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE (tenant_id, public_id)
            );
            CREATE INDEX idx_tickets_tenant ON tickets (tenant_id);

            CREATE TABLE ticket_comments (
                id UUID PRIMARY KEY,
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
                created_by UUID REFERENCES users(id) ON DELETE SET NULL,
                body TEXT,
                is_internal BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX idx_comments_ticket ON ticket_comments (ticket_id);

            CREATE TABLE attachments (
                id UUID PRIMARY KEY,
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
                comment_id UUID REFERENCES ticket_comments(id) ON DELETE CASCADE,
                file_url TEXT NOT NULL,
                file_name TEXT,
                mime_type TEXT,
                size_bytes BIGINT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX idx_attachments_ticket ON attachments (ticket_id);

            CREATE TABLE email_messages (
                id UUID PRIMARY KEY,
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
                message_id TEXT UNIQUE,
                in_reply_to TEXT,
                raw_headers TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX idx_email_message_id ON email_messages (message_id);
        `);
    }

    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryArray(`
            DROP TABLE IF EXISTS email_messages;
            DROP TABLE IF EXISTS attachments;
            DROP TABLE IF EXISTS ticket_comments;
            DROP TABLE IF EXISTS tickets;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS tenants;
        `);
    }
}
