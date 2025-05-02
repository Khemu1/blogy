# Blogy

**Blogy** is a website for creating and reading blogs with a seamless writing experience.

---

## Features

### User Management

- Create, edit, or delete blogs
- Add, edit, or delete comments

### Blog Creation

- **Markdown support** for rich formatting
- **Input sanitization** for security
- **Chunked image upload** (supports large files via chunking)

---

## Tech Stack

### Core

- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS + Daisy UI
- **Database**: PostgreSQL (with Sequelize ORM)
- **Rate Limiting**: Redis (with ioredis client)

### Media Handling

- **File Uploads**: FilePond (with **chunked uploads** for reliability)

### Testing & DevOps

- **Testing**: Jest (unit & integration)
- **CI/CD**: GitHub Actions (automated builds, tests, and deployments)

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- PostgreSQL `v15+`
- Redis `v7+`

### Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/blogy.git
   cd blogy
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:  
   Create `.env` file (use `.env.example` as a template):
   ```env
   JWT_ACCESS_TOKEN_SECRET=your-secret-key
   JWT_REFRESH_TOKEN_SECRET=your-secret-key
   JWT_ACCESS_TOKEN_EXPIRE=your-access-token-expiration-time
   JWT_REFRESH_TOKEN_EXPIRE=your-refresh-token-expiration-time
   DB_USERNAME=your-database-username
   DB_PASSWORD=your-database-password
   DB_DATABASE=your-database-name
   DB_HOST=your-database-host
   DB_PORT=your-database-port
   NODE_ENV=development
   DIALECT=postgres

   ```
4. **Run migrations**:
   ```bash
   npx sequelize-cli db:migrate
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

### Running Tests

```bash
npm test
```

---

## Development Workflow

- **GitHub Actions CI Pipeline**
  - Runs tests on every `push`/`pull request`
  - Ensures build stability before merging
- **Efficient Media Handling**
  - Chunk-based image uploads for better performance
  - Progress tracking & retry support
