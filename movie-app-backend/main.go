package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/piyumimdasanayaka/top100movies/datastore"
	"github.com/piyumimdasanayaka/top100movies/handler"
	"github.com/spf13/viper"
)

func init() {
	viper.SetConfigName("app.conf")
	viper.AddConfigPath("./config/")
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Failed to load configs: %v", err)
		return
	}
}

func main() {
	err := datastore.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
		return
	}

	engine := gin.Default()
	engine.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	engine.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{
			"error": gin.H{
				"message": "Not found",
			},
		})
	})

	v1 := engine.Group("/api/v1")
	{
		movies := v1.Group("/movies")
		{
			movies.POST("", handler.CreateMovie)
			movies.GET("", handler.GetAllMovies)
			movies.GET("/:id", handler.GetMovie)
			movies.PUT("/:id", handler.UpdateMovie)
			movies.DELETE("/:id", handler.DeleteMovie)
			movies.GET("/top", handler.GetTopMovies)
		}
	}

	// Start server
	log.Println("Server starting on port 8080...")
	if err := engine.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

	// Set up a channel to listen for interrupt signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	go func() {

		// Block until a signal is received
		<-quit
		fmt.Printf("server is shutting down...\n")

		if err := datastore.Shutdown(); err != nil {
			log.Fatalf("Failed to close database connection: %v", err)
			return
		}
	}()
}
