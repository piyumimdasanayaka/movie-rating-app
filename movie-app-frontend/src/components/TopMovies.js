import React, { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';

const TopMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopMovies();
  }, []);

  const fetchTopMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getTopMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch top movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading top movies...</p></Container>;

  return (
    <Container className="mt-4">
      <h2>Top 100 Movies</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {movies.length === 0 ? (
        <p>No movies found. Add some movies to get started!</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Genre</th>
              <th>Director</th>
              <th>Stars</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={movie.id}>
                <td>{index + 1}</td>
                <td>{movie.name}</td>
                <td>{movie.genre}</td>
                <td>{movie.director}</td>
                <td>{movie.stars} ⭐</td>
                <td>
                  <Link to={`/movie/${movie.id}`} className="btn btn-info btn-sm">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TopMovies;