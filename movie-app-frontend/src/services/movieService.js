import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const movieService = {
  getAllMovies: async () => {
    try {
      const response = await axios.get(`${API_URL}/movies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with id ${id}:`, error);
      throw error;
    }
  },

  createMovie: async (movieData) => {
    try {
      const response = await axios.post(`${API_URL}/movies`, movieData);
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  updateMovie: async (id, movieData) => {
    try {
      const response = await axios.put(`${API_URL}/movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      console.error(`Error updating movie with id ${id}:`, error);
      throw error;
    }
  },

  deleteMovie: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting movie with id ${id}:`, error);
      throw error;
    }
  },

  getTopMovies: async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/top`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top movies:', error);
      throw error;
    }
  },
};

export default movieService;