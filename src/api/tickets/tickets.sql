-- name: GetNextTicketNumber :one
SELECT COALESCE(MAX(public_id), 0) + 1 AS next_number
FROM tickets
WHERE tenant_id = $1;

-- name: CreateTicket :one
INSERT INTO tickets (id, tenant_id, public_id, subject, description, status, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: ListTickets :many
SELECT * FROM tickets
WHERE tenant_id = $1
ORDER BY created_at DESC;

-- name: GetTicket :one
SELECT * FROM tickets
WHERE tenant_id = $1 AND id = $2;
