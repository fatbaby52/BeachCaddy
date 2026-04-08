# ShoreReady - Beach Concierge App

A mobile-first React web application for beach setup and concierge services. Customers book beach equipment packages, add extras, choose a preferred setup area, and pay. The business manages everything through an admin dashboard.

## Tech Stack

- **Frontend:** React 18 + Vite, React Router, Tailwind CSS, Zustand
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Payments:** Stripe (mock mode available)
- **Storage:** Supabase Storage

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- (Optional) Stripe account for payments

### 1. Clone and Install

```bash
cd shoreready

# Install frontend
cd client
npm install

# Install backend
cd ../server
npm install
```

### 2. Configure Environment

Copy the example env files:

```bash
# In /server
cp .env.example .env

# In /client
cp .env.example .env
```

Update with your Supabase credentials:

**server/.env:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

**client/.env:**
```
VITE_SUPABASE_URL=https://[PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database

```bash
cd server

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

## Project Structure

```
shoreready/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API clients
│   │   └── utils/          # Helper functions
│   └── ...
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Seed data
│   └── src/
│       ├── routes/         # API routes
│       ├── middleware/     # Auth, upload, etc.
│       └── services/       # Email, etc.
└── ...
```

## Features

### Customer Features
- Browse packages and individual items
- Multi-step booking wizard (location, date, time, group size, zone preference)
- Visual menu with add-to-cart functionality
- Promo code support
- Order confirmation with calendar export

### Admin Features
- Dashboard with daily stats
- Booking management with status updates
- Menu and package editor
- Inventory tracking
- Promo code management
- Beach location management

## Sample Accounts

After seeding, you can log in as admin:
- **Email:** admin@shoreready.com
- **Password:** admin123

## Promo Codes

- `FIRSTBEACH` - 20% off
- `SUMMER10` - $10 off
- `WELCOME` - 15% off

## Customization

### Colors (tailwind.config.js)

```javascript
colors: {
  sand: { /* warm beige tones */ },
  ocean: { /* coastal blue tones */ },
  coral: { /* accent orange */ },
  sunset: { /* warm gold tones */ },
}
```

### Fonts

- **Display:** Playfair Display (headings, package names)
- **Body:** DM Sans (everything else)

## License

MIT
