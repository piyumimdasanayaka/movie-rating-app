import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import MovieForm from './components/MovieForm';
import TopMovies from './components/TopMovies';


function App() {
  return (
    <Router>
      <NavBar />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/add-movie" element={<MovieForm />} />
          <Route path="/edit-movie/:id" element={<MovieForm />} />
          <Route path="/top-movies" element={<TopMovies />} />
        </Routes>
    </Router>
  );
}


export default App;
