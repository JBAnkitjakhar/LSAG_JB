// server/main.go
package main

import (
    
    "os"
    "encoding/base64"
    "encoding/hex"
    "encoding/json"
    "log"
    "net/http"

    "github.com/gorilla/mux"
    "github.com/rs/cors"
    "github.com/zbohm/lirisi/client"
    "github.com/zbohm/lirisi/ring"
)

type KeyPair struct {
    PublicKey     string `json:"publicKey"`
    PrivateKey    string `json:"privateKey"`
    Status        string `json:"status"`
    Digest        string `json:"digest"`
    KeyCoordinate string `json:"keyCoordinate"` // Added for verification
}

type ErrorResponse struct {
    Error string `json:"error"`
}

func generateKeysHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    // Generate private key using prime256v1 (P-256) curve
    // This is important as it's the same curve used in Lirisi examples
    status, privateKeyBytes := client.GeneratePrivateKey("prime256v1", "PEM")
    if status != ring.Success {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(ErrorResponse{
            Error: ring.ErrorMessages[status],
        })
        return
    }

    // Derive public key
    status, publicKeyBytes := client.DerivePublicKey(privateKeyBytes, "PEM")
    if status != ring.Success {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(ErrorResponse{
            Error: ring.ErrorMessages[status],
        })
        return
    }

    // Get public key coordinates for verification
    status, coordinates := client.PublicKeyXYCoordinates(publicKeyBytes)
    if status != ring.Success {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(ErrorResponse{
            Error: ring.ErrorMessages[status],
        })
        return
    }

    // Create a slice of public keys for digest calculation
    pubKeysContent := [][]byte{publicKeyBytes}
    status, foldedPublicKeys := client.FoldPublicKeys(pubKeysContent, "sha3-256", "PEM", "notsort")
    if status != ring.Success {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(ErrorResponse{
            Error: ring.ErrorMessages[status],
        })
        return
    }

    // Get digest
    status, digest := client.PublicKeysDigest(foldedPublicKeys, true)
    if status != ring.Success {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(ErrorResponse{
            Error: ring.ErrorMessages[status],
        })
        return
    }

    // Create response
    keyPair := KeyPair{
        PublicKey:     base64.StdEncoding.EncodeToString(publicKeyBytes),
        PrivateKey:    base64.StdEncoding.EncodeToString(privateKeyBytes),
        Status:        "success",
        Digest:        string(digest),
        KeyCoordinate: hex.EncodeToString(coordinates),
    }

    json.NewEncoder(w).Encode(keyPair)
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "status": "healthy",
    })
}

func main() {
    log.SetFlags(log.LstdFlags | log.Lshortfile)

    r := mux.NewRouter()
    
    // Routes
    r.HandleFunc("/generate-keys", generateKeysHandler).Methods("POST")
    r.HandleFunc("/health", healthCheckHandler).Methods("GET")
    
    // CORS middleware
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"https://lsag-jbuptogenerationphase.vercel.app"}, // Will update this after deployment
        AllowedMethods: []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders: []string{"Content-Type", "Authorization"},
        Debug:          false,
    })

    handler := c.Handler(r)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Starting server on :%s", port)
    log.Fatal(http.ListenAndServe(":"+port, handler))
}