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
- **redis**: Redis

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
   DATABASE_URL="postgres://user:password@localhost:5432/blogy"
   REDIS_URL="redis://localhost:6379"
   SECRET_KEY="your-secret-key"
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
