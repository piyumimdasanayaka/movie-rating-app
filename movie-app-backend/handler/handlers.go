package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/piyumimdasanayaka/top100movies/datastore"
)

type MovieHandler struct {
	DB *sql.DB
}

func CreateMovie(c *gin.Context) {
	var movie *datastore.Movie
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate stars rating (1-5)
	if movie.Stars < 1 || movie.Stars > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stars rating must be between 1 and 5"})
		return
	}

	id, err := datastore.InsertMovie(movie)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error inserting movie: %v", err)})
		return
	}

	movie.ID = id
	c.JSON(http.StatusCreated, movie)
}

// Get a specific movie by ID
func GetMovie(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	var movie *datastore.Movie
	movie, err = datastore.GetMovie(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error retrieving movie: %v", err)})
		return
	}

	c.JSON(http.StatusOK, movie)
}

func GetAllMovies(c *gin.Context) {
	// id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
	// 	return
	// }

	movies, err := datastore.GetMovies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error retrieving movie: %v", err)})
		return
	}

	c.JSON(http.StatusOK, movies)
}

func UpdateMovie(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	fmt.Println(err)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}
	fmt.Println(id)

	var movie *datastore.Movie
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie.ID = id
	// Validate stars rating (1-5)
	if movie.Stars < 1 || movie.Stars > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stars rating must be between 1 and 5"})
		return
	}
	err = datastore.UpdateMovies(movie)
	fmt.Println(err)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error updating movie: %v", err)})
		return
	}

	c.JSON(http.StatusOK, movie)
}

func DeleteMovie(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	err = datastore.DeleteMovie(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error deleting movie: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Movie deleted successfully"})
}

func GetTopMovies(c *gin.Context) {
	movies, err := datastore.GetTopMovies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error scanning movies: %v", err)})
		return
	}

	c.JSON(http.StatusOK, movies)
}
