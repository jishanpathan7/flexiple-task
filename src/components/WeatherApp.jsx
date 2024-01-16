//* Packages Imports */
import React, { useEffect, useRef, useState } from "react";

//* Components Imports */
import WeatherData from "./WeatherData";
import WeatherSearchForm from "./WeatherSearch";

//* Assets Imports */
import linkIcon from "../assets/external-link.svg";

const WeatherApp = () => {
  const inputValue = useRef();
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [myData, setMyData] = useState([]);
  const [cityDetails, setCityDetails] = useState([]);
  const [dataWeather, setDataWeather] = useState([]);
  const [windData, setWindData] = useState([]);
  const API_KEY = process.env.REACT_APP_API_KEY;

  // API Search Handler
  const handleSearch = async () => {
    const newCityName = inputValue.current.value;
    if (newCityName.trim() !== "") {
      setCityName(newCityName);
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${newCityName}&APPID=${API_KEY}&units=metric&lang=${"en"}`
        );
        const data = await response.json();
        if (response.ok) {
          setCityDetails(data.city);
          setMyData(data.list[0].main);
          setDataWeather(data.list[0].weather[0]);
          setWindData(data.list[0].wind);
          setError(false);

          localStorage.setItem("lastSearchedCity", newCityName);
          localStorage.setItem(
            "weatherData",
            JSON.stringify({
              cityDetails: data.city,
              myData: data.list[0].main,
              dataWeather: data.list[0].weather[0],
              windData: data.list[0].wind,
            })
          );
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.error("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Load last searched city and weather data from local storage
    const storedCity = localStorage.getItem("lastSearchedCity");
    const storedWeatherData = JSON.parse(localStorage.getItem("weatherData"));

    if (storedCity && storedWeatherData) {
      setCityName(storedCity);
      setCityDetails(storedWeatherData.cityDetails);
      setMyData(storedWeatherData.myData);
      setDataWeather(storedWeatherData.dataWeather);
      setWindData(storedWeatherData.windData);
    }
  }, []);

  return (
    <div className="box">
      <div className="cityName">
        {cityName && !loading ? (
          <p>
            {cityDetails.name}, {cityDetails.country}
            <a
              href={`https://en.wikipedia.org/wiki/${cityDetails.name}`}
              target="_ "
            >
              <img src={linkIcon} alt="link" />
            </a>
          </p>
        ) : (
          <div>
            {error && <span className="invalid">Invalid City Name</span>}
          </div>
        )}
        <WeatherSearchForm
          inputValue={inputValue}
          handleSearch={handleSearch}
        />
      </div>

      {cityName && !loading ? (
        <WeatherData
          weatherData={myData}
          weather={dataWeather}
          city={cityDetails}
          windData={windData}
        />
      ) : (
        <div className="blankData">
          <p>Welcome to the Weather App!</p>
          <p>Please enter a city name above to see the weather forecast.</p>
        </div>
      )}

      {loading && (
        <div className="loaderContainer">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
