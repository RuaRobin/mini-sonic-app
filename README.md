# Angular Frontend Auth App


---

## Tech Stack

- **Angular 17+** (module-based, not standalone)
- **Angular Material** — UI components (cards, inputs, buttons)
- **Reactive Forms** — form handling and validation
- **@auth0/angular-jwt** — JWT encoding/decoding and expiry checks
- **ngx-toastr** — toast notifications
- **localStorage** — persistence layer (users + JWT token)

---

## Project Structure

```
src/
├── app/
│   ├── login/
│   │   ├── signin/
│   │   │   ├── login.component.ts
│   │   │   └── login.component.html
│   │   ├── create-account/
│   │   │   ├── create-account.component.ts
│   │   │   └── create-account.component.html
│   │   ├── auth.service.ts        # JWT generation, login, expiry
│   │   ├── login.service.ts       # User store (dummy data + localStorage)
│   │   └── user.model.ts          # User interface
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.component.html
│   ├── dummydata/
│   │   └── users.ts               # Hardcoded seed users
│   ├── validators/
│   │   ├── email-validators.ts    # Custom TLD email validator
│   │   └── match-fields-validator.ts  # Password match validator
│   ├── auth-guard.service.ts      # Route protection
│   ├── notification.service.ts    # Toastr wrapper
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.component.html
```

---

## Routes

| Path         | Component              | Protected |
|--------------|------------------------|-----------|
| `/login`     | `LoginComponent`       | No        |
| `/signup`    | `CreateAccountComponent` | No      |
| `/dashboard` | `DashboardComponent`   | ✅ Yes (AuthGuard) |
| `/`          | Redirects to `/login`  | —         |

---

## Features

### Authentication
- Login validates credentials against an in-memory + localStorage user store
- On success, generates a JWT-like token (`header.payload.signature`) and stores it in `localStorage`
- Token payload contains: `sub` (user ID), `email`, `role`, `iat`, `exp`
- `JwtHelperService.isTokenExpired()` checks the `exp` claim on every route guard evaluation — sessions expire after **1 hour**
- `AuthGuard` protects the dashboard route and redirects unauthenticated users to `/login`

### Registration
- New accounts are validated for duplicate email/username before being saved
- Saved users persist in `localStorage` and are merged with the seed data on app load
- User IDs auto-increment safely across page refreshes by deriving `nextID` from the highest stored ID
- After registration, the user is automatically logged in and redirected to the dashboard

### Dashboard
- Decodes the JWT token to extract `sub` (user ID)
- Looks up the full user record from `LoginService` using the ID — this covers both seed users and registered users

### Validation
- Email: required + Angular's built-in email validator + custom TLD validator (`.com`, `.net`, `.org`, etc.)
- Password: required + minimum 8 characters
- Confirm Password: must match the password field (cross-field validator)
- Username: required + max 250 characters

---

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)

### Install dependencies
```bash
npm install
```

### Run the dev server
```bash
ng serve
```

Navigate to `http://localhost:4200`. The app redirects to `/login` by default.

### Seed users
Pre-loaded users are defined in `src/app/dummydata/users.ts`. Edit that file to add default accounts for testing.

---

## Known Limitations & Future Work

| Area | Current State | Future Plan |
|------|--------------|-------------|
| JWT signing | Unsigned (base64 placeholder signature) | Real HMAC signing from backend |
| Password storage | Plaintext in localStorage | Hashed + stored server-side |
| User persistence | localStorage only | REST API / database |
| Token refresh | Not implemented | Refresh token flow |
| Forgot password | Route placeholder only | Email reset flow |
| Role-based access | Role in token, not enforced | Guard per role |

---

## Notes

The JWT implementation is intentionally simplified for frontend-only development. The token is **not cryptographically signed** — the signature segment is a placeholder. When a backend is introduced, replace the token-building logic in `AuthService.login()` with an HTTP call and store the token returned by the server. Everything else (guard, expiry check, `getActiveUser()`) will continue to work without modification.
