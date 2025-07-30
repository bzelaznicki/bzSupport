-- name: GetUserByEmail :one
SELECT id, tenant_id, email, role, password_hash
FROM users
WHERE email = $1;

-- name: CreateRefreshToken :exec
INSERT INTO refresh_tokens (user_id, token, expires_at)
VALUES ($1, $2, $3);

-- name: GetRefreshToken :one
SELECT id, user_id, token, expires_at, revoked_at, created_at
FROM refresh_tokens
WHERE token = $1;

-- name: RevokeRefreshToken :exec
UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = $1;

-- name: DeleteUserRefreshTokens :exec
DELETE FROM refresh_tokens WHERE user_id = $1;
