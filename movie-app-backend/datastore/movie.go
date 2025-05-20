package datastore

import (
	"database/sql"
	"fmt"
)

type Movie struct {
	ID        int64  `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Genre     string `json:"genre" db:"genre"`
	Director  string `json:"director" db:"director"`
	Stars     int    `json:"stars" db:"stars"`
	Comment   string `json:"comment" db:"comment"`
	EnteredBy string `json:"entered_by" db:"entered_by"`
}

func InsertMovie(movie *Movie) (int64, error) {
	insertSQL := `
	INSERT INTO movies (name, genre, director, stars, comment, entered_by)
	VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING id`

	var id int64
	err := db.QueryRow(
		insertSQL,
		movie.Name,
		movie.Genre,
		movie.Director,
		movie.Stars,
		movie.Comment,
		movie.EnteredBy,
	).Scan(&id)

	if err != nil {
		return 0, fmt.Errorf("error inserting movie: %v", err)
	}

	return id, nil
}

func GetMovie(id int64) (*Movie, error) {
	var movie Movie
	err := db.QueryRow(`
		SELECT id, name, genre, director, stars, comment, entered_by
		FROM movies WHERE id = $1`, id).Scan(
		&movie.ID,
		&movie.Name,
		&movie.Genre,
		&movie.Director,
		&movie.Stars,
		&movie.Comment,
		&movie.EnteredBy,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("movie not found: %v", err)
		}
	}

	return &movie, nil
}

func GetMovies() ([]*Movie, error) {
	var movies []*Movie
	rows, err := db.Query(`
		SELECT id, name, genre, director, stars, comment, entered_by
		FROM movies ORDER BY id DESC`)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("movies not found: %v", err)
		}
		return nil, err
	}

	for rows.Next() {
		var movie Movie
		if err := rows.Scan(
			&movie.ID,
			&movie.Name,
			&movie.Genre,
			&movie.Director,
			&movie.Stars,
			&movie.Comment,
			&movie.EnteredBy,
		); err != nil {
			return nil, fmt.Errorf("error scanning movie row: %v", err)
		}
		movies = append(movies, &movie)
	}
	return movies, nil
}

func UpdateMovies(movie *Movie) error {
	updateSQL := `
	UPDATE movies 
	SET name = $1, genre = $2, director = $3, stars = $4, comment = $5, entered_by = $6
	WHERE id = $7`

	_, err := db.Query(
		updateSQL,
		movie.Name,
		movie.Genre,
		movie.Director,
		movie.Stars,
		movie.Comment,
		movie.EnteredBy,
		movie.ID,
	)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("error updating movie: %v", err)
	}

	return nil
}

func DeleteMovie(id int64) error {
	deleteSQL := `DELETE FROM movies WHERE id = $1`
	_, err := db.Query(deleteSQL, id)
	if err != nil {
		return fmt.Errorf("error deleting movie: %v", err)
	}

	return nil
}

func GetTopMovies() ([]*Movie, error) {
	limit := 100

	rows, err := db.Query(`
		SELECT id, name, genre, director, stars, comment, entered_by
		FROM movies 
		ORDER BY stars DESC, name ASC
		LIMIT $1`, limit)

	if err != nil {
		return nil, fmt.Errorf("error retrieving top movies: %v", err)
	}
	defer rows.Close()

	var movies []*Movie
	for rows.Next() {
		var movie Movie
		if err := rows.Scan(
			&movie.ID,
			&movie.Name,
			&movie.Genre,
			&movie.Director,
			&movie.Stars,
			&movie.Comment,
			&movie.EnteredBy,
		); err != nil {
			return nil, fmt.Errorf("error scanning movie row: %v", err)

		}

		movies = append(movies, &movie)
	}

	return movies, nil
}
