-- name: GetUserByEmail :one
SELECT id, tenant_id, email, role, password_hash
FROM users
WHERE email = $1;