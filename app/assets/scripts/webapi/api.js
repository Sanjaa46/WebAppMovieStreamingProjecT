async function fetchAllMovies() {
    try {
      const response = await fetch('http://localhost:3000/movies');
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      const movies = await response.json();
      return movies;
    } catch (error) {
      console.error('Error fetching movies:', error.message);
      return [];
    }
  }
  
  async function fetchMovieById(movieId) {
    try {
      const response = await fetch(`http://localhost:3000/movies/${movieId}`);
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      const movie = await response.json();
      return movie;
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error.message);
      return null;
    }
  }
  
  async function searchMovies(query) {
    try {
      const response = await fetch(`http://localhost:3000/movies?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      const movies = await response.json();
      return movies;
    } catch (error) {
      console.error('Error searching movies:', error.message);
      return [];
    }
  }
  
  export { fetchAllMovies, fetchMovieById, searchMovies };
  