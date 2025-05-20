import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import movieService from '../services/movieService';

const MovieForm = () => {
    console.log("Movieeeee")
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;


  const [movie, setMovie] = useState({
    name: '',
    genre: '',
    director: '',
    stars: 5,
    comment: '',
    entered_by: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  
  const fetchMovie = useCallback(async () => {
    try {
      const data = await movieService.getMovieById(id);
      setMovie(data);
    } catch (err) {
      setError('Failed to fetch movie details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]); // Only recreate this function if 'id' changes
  
  useEffect(() => {
    if (isEditing) {
      fetchMovie();
    }
  }, [isEditing, fetchMovie]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({
      ...movie,
      [name]: name === 'stars' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (isEditing) {
        await movieService.updateMovie(id, movie);
      } else {
        await movieService.createMovie(movie);
      }
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} movie. Please try again.`);
      console.error(err);
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading movie details...</p></Container>;

  return (
    <Container className="mt-4">
      <h2>{isEditing ? 'Edit Movie' : 'Add New Movie'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Movie Title</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={movie.name}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter a movie title.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Genre</Form.Label>
          <Form.Control
            type="text"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter a genre.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Director</Form.Label>
          <Form.Control
            type="text"
            name="director"
            value={movie.director}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter a director name.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating (1-5 Stars)</Form.Label>
          <Form.Control
            type="number"
            name="stars"
            min="1"
            max="5"
            value={movie.stars}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter a rating between 1 and 5.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comment (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="comment"
            value={movie.comment}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            name="entered_by"
            value={movie.entered_by}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">Please enter your name.</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEditing ? 'Update Movie' : 'Add Movie'}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default MovieForm;