# JWT Implementation Approach

## Goal

Use stateless authentication so API clients can authenticate once and call protected endpoints using a Bearer token.

## Components

- `AuthController` exposes:
- `POST /auth/register`
- `POST /auth/login`
- `AuthService`:
- hashes passwords with `bcrypt`
- validates credentials
- issues JWT access token
- `JwtModule`:
- configured with `JWT_SECRET`
- token expiry from `JWT_EXPIRES_IN` (default `7d`)
- `JwtStrategy`:
- extracts token from `Authorization: Bearer <token>`
- verifies signature + expiry
- validates user still exists in DB
- `JwtAuthGuard`:

## Token Issuance Flow

1. Client calls `POST /auth/register` or `POST /auth/login`.
2. Service verifies/creates user credentials.
3. Service signs JWT payload:

- `userId`
- `role`

4. API returns:

- `accessToken`
- sanitized user object

## Request Authentication Flow

1. Client sends `Authorization: Bearer <accessToken>`.
2. `JwtAuthGuard` triggers `JwtStrategy`.
3. Strategy verifies token using `JWT_SECRET` and checks expiration.
4. Strategy loads user from DB by `userId`.
5. If valid, `request.user = { userId, role }` is attached for controllers/guards.

## Authorization Flow
-  `@UseGuards(JwtAuthGuard)` on protected endpoints checks for valid token.

## Example Protected Call

```http
GET /users?page=1&limit=20
Authorization: Bearer <accessToken>
```

## Security Notes

- Passwords are never stored in plain text (bcrypt hash).
- JWT expiry is enforced (`ignoreExpiration: false`).
- Invalid token users are rejected if user is removed from database.
- `JWT_SECRET` must be set in environment variables for production.
