# Full-Stack Calculator (Go + React)

A minimalist web calculator application structured around Clean Architecture principles and RESTful microservices.

## 1. Design Decisions (Design Rationale)

To meet the requirement of prioritizing correctness, clarity, and maintainability, the following architectural decisions were made:

* **Separation of Concerns:** The frontend (React) and backend (Golang) operate as isolated processes. They communicate strictly through a REST API.
* **Strict Typing and API Contracts:** TypeScript was used on the frontend with interfaces that exactly map the backend responses, avoiding runtime casting errors.
* **Idiomatic Error Handling:** The Go backend does not use exceptions; instead, it returns errors as values that are translated into semantic HTTP status codes (e.g., `400 Bad Request` for division by zero).
* **Maintainability:** The Go code is structured using community-standard conventions (`cmd/api` for the entry point, `internal/` for encapsulating business logic).

## 2. Setup Instructions (Setup)

### Prerequisites

* [Go](https://go.dev/) 1.21 or higher.
* [Node.js](https://nodejs.org/) 18 or higher.

### Running the Backend (Golang)

From the project root:

1. `cd backend`
2. `go run cmd/api/main.go`
   *The server will start at [http://localhost:8080](http://localhost:8080)*

### Running the Frontend (React + Vite)

From the project root in a new terminal:

1. `cd frontend`
2. `npm install`
3. `npm run dev`
   *The interface will be available at [http://localhost:5173](http://localhost:5173)*

## 3. API Usage (API Examples)

The backend exposes a single endpoint for all operations, receiving the parameters through the URL (Query Parameters).

**Endpoint:** `GET /api/v1/calculate`

**Request Example (cURL):**

```bash
curl "http://localhost:8080/api/v1/calculate?a=10&b=5&operation=divide"
```

**Response Example (Success - HTTP 200):**

```json
{
  "result": 2
}
```

**Response Example (Error - HTTP 400):**

```json
{
  "error": "cannot divide by zero"
}
```
