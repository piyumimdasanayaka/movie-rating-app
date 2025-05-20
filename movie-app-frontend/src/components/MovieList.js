import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getAllMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        setMovies(movies.filter(movie => movie.id !== id));
      } catch (err) {
        setError('Failed to delete movie. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading movies...</p></Container>;
  
  return (
    <Container className="mt-4">
      <h2>All Movies</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {movies.length === 0 ? (
        <p>No movies found. Add some movies to get started!</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Genre</th>
              <th>Director</th>
              <th>Stars</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.name}</td>
                <td>{movie.genre}</td>
                <td>{movie.director}</td>
                <td>{movie.stars} ⭐</td>
                <td>{movie.entered_by}</td>
                <td>
                  <Link to={`/movie/${movie.id}`} className="btn btn-info btn-sm me-2">View</Link>
                  <Link to={`/edit-movie/${movie.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(movie.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <Link to="/add-movie" className="btn btn-primary mt-3">Add New Movie</Link>
    </Container>
  );
};

export default MovieList;