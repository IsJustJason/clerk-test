package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/joho/godotenv"
)

func init() {
	// 1. Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using environment variables")
	}
}

func main() {
	clerk.SetKey(os.Getenv("CLERK_SECRET"))

	mux := http.NewServeMux()

	corsMiddleware := corsMiddleware([]string{"http://127.0.0.1:5173", "http://localhost:5173", "https://swipe-play.com"})

	mux.Handle("/api/test", corsMiddleware(clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(test_handler))))

	log.Println("Server started on port 8080")
	http.ListenAndServe(":8080", mux)
}

func corsMiddleware(allowedOrigins []string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			allowed := false
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					allowed = true
					break
				}
			}

			if allowed {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func test_handler(w http.ResponseWriter, r *http.Request) {
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Hello, %s!", claims.Subject)))
}
