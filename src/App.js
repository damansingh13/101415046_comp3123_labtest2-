import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState('');

  const apiKey = '2c28b24bddebecc0b037865a91e00fbb'; // OpenWeatherMap API Key

  // Fetch weather data from OpenWeatherMap
  const fetchWeather = async (city) => {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(weatherUrl);
      setWeather(response.data);
      setWeatherCondition(response.data.weather[0].main.toLowerCase()); // Set weather condition for background
      setError(null); // Clear any previous error
      fetchUvIndex(response.data.coord.lat, response.data.coord.lon); // Fetch UV index for the city
    } catch (err) {
      setWeather(null);
      setError('City not found or API issue');
      setWeatherCondition('');
    }
  };

  // Fetch UV Index data from OpenWeatherMap
  const fetchUvIndex = async (lat, lon) => {
    const uvUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
      const response = await axios.get(uvUrl);
      setUvIndex(response.data.value); // Set UV index value
    } catch (err) {
      setUvIndex(null); // Handle error if UV index is unavailable
    }
  };

  const handleSearch = () => {
    if (city) {
      fetchWeather(city); // Fetch weather for the entered city
    }
  };

  // Dynamically apply the weather condition class to the body tag for background
  useEffect(() => {
    // Dynamically set background image based on weather condition
    if (weatherCondition) {
      document.body.classList.remove('clear', 'rain', 'clouds', 'snow'); // Remove all previous classes
      document.body.classList.add(weatherCondition); // Add new background class
    }
  }, [weatherCondition]);

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)} // Update city as user types
        placeholder="Enter city"
      />
      <button onClick={handleSearch}>Search</button>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Weather data display */}
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>Population: {weather.population ? weather.population : "N/A"}</p>
          <p>UV Index: {uvIndex !== null ? uvIndex : "N/A"}</p>
          <img
            src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

export default App;
