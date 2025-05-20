package datastore

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/spf13/viper"
)

var db *sql.DB

func InitDB() error {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",

		viper.GetString("postgres.host"),
		viper.GetInt("postgres.port"),
		viper.GetString("postgres.user"),
		viper.GetString("postgres.password"),
		viper.GetString("postgres.database"),
	)

	s, err := sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	db = s
	err = db.Ping()
	if err != nil {
		return err
	}

	err = createTablesIfNotExist(db)
	if err != nil {
		return err
	}

	log.Println("Successfully connected to database")
	return err
}

func createTablesIfNotExist(db *sql.DB) error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS movies (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		genre VARCHAR(100) NOT NULL,
		director VARCHAR(255) NOT NULL,
		stars INTEGER NOT NULL,
		comment TEXT,
		entered_by VARCHAR(100) NOT NULL
	);`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("error creating movies table: %v", err)
	}

	return nil
}

func Shutdown() error {
	err := db.Close()

	return err
}
