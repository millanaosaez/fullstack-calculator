# Fullstack Calculator

*[Leer en español](./README.es.md)*

A web calculator with a Go backend and a React + TypeScript frontend, containerized with Docker.

## Architecture

fullstack-calculator/
├── backend/ # REST API in Go
├── frontend/ # React + TypeScript + Vite
└── docker-compose.yml


- **Backend**: exposes a calculation endpoint (`/api/v1/calculate`) supporting addition, subtraction, multiplication, division, exponentiation, square root, cube root, and percentage.
- **Frontend**: a calculator UI that consumes the backend API.

## Requirements

- [Docker](https://www.docker.com/) and Docker Compose
- For local development without Docker: Go 1.26+ and Node.js 22+

## Running the project

### With Docker (recommended)

From the project root:

```bash
docker compose up --build
```

This starts:
- **Backend** at `http://localhost:8080`
- **Frontend** at `http://localhost:80`

To stop:
```bash
docker compose down
```

### Without Docker (local development)

**Backend:**
```bash
cd backend
go run ./cmd/api/main.go
```
The server will be available at `http://localhost:8080`.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173` (Vite's default port).

> Note: when running the frontend locally (`npm run dev`), make sure the 
> backend is running on `localhost:8080`, since the frontend points to 
> that fixed URL in `apiService.ts`.

## API

### `GET /api/v1/calculate`

**Query params:**

| Parameter   | Type     | Required | Description                                                                  |
|-------------|----------|----------|--------------------------------------------------------------------------------|
| `a`         | number   | Yes      | First operand                                                                 |
| `b`         | number   | Depends  | Second operand (not required for unary operations like `sqrt`/`cbrt`)         |
| `operation` | string   | Yes      | One of: `add`, `subtract`, `multiply`, `divide`, `exponentiate`, `sqrt`, `cbrt`, `percentage` |

**Successful response (200):**
```json
{ "result": 8 }
```

**Error response (4xx/5xx):**
```json
{ "error": "Cannot divide by zero" }
```

## Testing

The frontend has a complete unit and integration test suite (Vitest + React Testing Library), with 100% coverage across business logic, the API layer, and UI components.

```bash
cd frontend
npm test               # watch mode
npm run test:coverage  # single run with coverage report
```

The HTML coverage report is generated at `frontend/coverage/index.html`.

## Tech stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Vitest + React Testing Library + jest-dom

**Backend:**
- Go 1.26

**Infrastructure:**
- Docker + Docker Compose
- Nginx (serving the frontend's production build)

---

## Frontend development notes (Vite details)

This project uses Vite as its bundler, with HMR and ESLint configured. Two official plugins are currently available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### React Compiler

The React Compiler is not enabled on this project due to its impact on dev and build performance. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you're developing for production, it's recommended to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      tseslint.configs.recommendedTypeChecked,
      // Or, for stricter rules:
      tseslint.configs.strictTypeChecked,
      // Optionally, add stylistic rules:
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```