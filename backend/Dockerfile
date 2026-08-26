FROM golang:1.26.4-alpine AS builder
WORKDIR /app
COPY go.mod ./

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /calculator-api ./cmd/api/main.go


FROM alpine:latest
WORKDIR /root/
COPY --from=builder /calculator-api .
EXPOSE 8080
CMD ["./calculator-api"]