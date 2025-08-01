# bzSupport

Ticket support platform built with Deno

## Security

This application includes several security measures and follows security best
practices. See [SECURITY.md](./SECURITY.md) for detailed information about:

- Authentication and authorization
- Input validation and sanitization
- Rate limiting and protection against brute force attacks
- Security headers and HTTPS enforcement
- Database security configurations

## Environment Variables

Copy `.env.example` to `.env` and configure the required environment variables:

```bash
cp .env.example .env
```

**Important**: Make sure to set a secure `JWT_SECRET` value in production.
Generate a random secret:

```bash
openssl rand -base64 32
```

## Getting Started

```bash
# Install dependencies and start development server
deno task dev

# Run database migrations
deno task migrate:up

# Lint code
deno task lint

# Format code  
deno task fmt
```
