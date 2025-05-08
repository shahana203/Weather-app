import React, { useEffect, useRef, useState } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

import background from '../assets/background.jpg'; // Default background image
import clear_bg from '../assets/clear-bg.jpg';
import cloud_bg from '../assets/cloud-bg.jpg';
import rain_bg from '../assets/rain-bg.jpg';
import snow_bg from '../assets/snow-bg.jpg';

import '../weather.css';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  // const [backgroundImage, setBackgroundImage] = useState(background); // Set default background
  const [errorMessage, setErrorMessage] = useState(""); // For invalid locations

  const allIcons = {
    "01d": clear_icon, "01n": clear_icon,
    "02d": cloud_icon, "02n": cloud_icon,
    "03d": cloud_icon, "03n": cloud_icon,
    "04d": drizzle_icon, "04n": drizzle_icon,
    "09d": rain_icon, "09n": rain_icon,
    "10d": rain_icon, "10n": rain_icon,
    "13d": snow_icon, "13n": snow_icon,
  };

  const allBackgrounds = {
    "01d": clear_bg, "01n": clear_bg,
    "02d": cloud_bg, "02n": cloud_bg,
    "03d": cloud_bg, "03n": cloud_bg,
    "04d": cloud_bg, "04n": cloud_bg,
    "09d": rain_bg, "09n": rain_bg,
    "10d": rain_bg, "10n": rain_bg,
    "13d": snow_bg, "13n": snow_bg,
  };

  const search = async (city) => {
    if (!city) {
      setErrorMessage("Please enter a city name.");
      setWeatherData(null);
      // setBackgroundImage(background);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        setErrorMessage("Invalid Location. Try again!");
        setWeatherData(null);
        // setBackgroundImage(background);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        condition: data.weather[0].description,
        icon: allIcons[data.weather[0].icon] || clear_icon,
      });

      // setBackgroundImage(allBackgrounds[data.weather[0].icon] || clear_bg);
      setErrorMessage(""); // Clear error if a valid city is found
    } catch (error) {
      setErrorMessage("Error fetching weather data.");
      setWeatherData(null);
      // setBackgroundImage(background);
      console.error("Error fetching weather data", error);
    }
  };

  return (
    // " style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="Weather">
      <div className="weather-card">
    < div className = "search-bar" >
          <input ref={inputRef} type="text" placeholder="Search City" />
          <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
        </div >

{
  errorMessage?(
          <p className = "error-message" > { errorMessage }</p>
        ) : weatherData ? (
  <>
    <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
    <p className="temperature">
      {weatherData.temperature}°C <br />
      <span className="weather-condition">{weatherData.condition}</span>
    </p>
    <div className="weather-data">
      <div className="col">
        <img src={humidity_icon} alt="Humidity" />
        <div>
          <p>{weatherData.humidity} %</p>
          <span>Humidity</span>
        </div>
      </div>
      <div className="col">
        <img src={wind_icon} alt="Wind Speed" />
        <div>
          <p>{weatherData.windSpeed} km/h</p>
          <span>Wind Speed</span>
        </div>
      </div>
    </div>
  </>
) : null}
      </div >
    </div >
  );
};

export default Weather;
