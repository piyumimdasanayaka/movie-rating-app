import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import movieService from '../services/movieService';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const data = await movieService.getMovieById(id);
      setMovie(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movie details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete movie. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading movie details...</p></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!movie) return <Container className="mt-4"><Alert variant="warning">Movie not found</Alert></Container>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2">{movie.name}</Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Genre:</strong> {movie.genre}
          </Card.Text>
          <Card.Text>
            <strong>Director:</strong> {movie.director}
          </Card.Text>
          <Card.Text>
            <strong>Rating:</strong> {movie.stars} ⭐
          </Card.Text>
          {movie.comment && (
            <Card.Text>
              <strong>Comment:</strong> {movie.comment}
            </Card.Text>
          )}
          <Card.Text>
            <strong>Added by:</strong> {movie.entered_by}
          </Card.Text>
          
          <div className="mt-3">
            <Link to={`/edit-movie/${movie.id}`} className="btn btn-warning me-2">Edit</Link>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
            <Link to="/" className="btn btn-secondary ms-2">Back to List</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MovieDetail;