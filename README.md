# aFlows - Agentic Workflows

Welcome to aFlows! This is an application where you can create and manage your own agentic workflows.

## Tech Stack

This project is built with a modern, type-safe stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **API**: [tRPC](https://trpc.io/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to get the project set up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or later recommended) or [bun](https://bun.sh/)
- A running PostgreSQL database instance.

### 1. Clone the Repository

```bash
git clone <https://github.com/suuumans/aFlows.git>
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and add your PostgreSQL database connection string:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 4. Run Database Migrations

Prisma will use the schema in `prisma/schema.prisma` to create the necessary tables in your database.

```bash
bunx prisma migrate dev
```

This will also generate the Prisma Client based on your schema.

### 5. Run the Development Server

You're all set! Start the Next.js development server:

```bash
bun run dev
```

Open http://localhost:3000 with your browser to see the result.

