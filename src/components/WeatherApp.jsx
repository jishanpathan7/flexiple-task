import React, { useEffect, useRef, useState } from "react";
import searchIcon from "../assets/search.svg";
import WeatherData from "./WeatherData";
import linkIcon from "../assets/external-link.svg";

const WeatherApp = () => {
  const inputValue = useRef();
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(false);
  const [myData, setMyData] = useState([]);
  const [cityDetails, setCityDetails] = useState([]);
  const [dataWeather, setDataWeather] = useState([]);
  const [windData, setWindData] = useState([]);
  const APP_KEY = "ac7f064efbe7fcb0b58561ab46ec4e57";

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

  const onkeydownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCityName(inputValue.current.value);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newCityName = inputValue.current.value;
    if (newCityName.trim() !== "") {
      setCityName(newCityName);
      fetchData(newCityName);
    }
  };

  const fetchData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${APP_KEY}&units=metric&lang=${"en"}`
      );
      const data = await response.json();
      if (response.ok) {
        setCityDetails(data.city);
        setMyData(data.list[0].main);
        setDataWeather(data.list[0].weather[0]);
        setWindData(data.list[0].wind);

        // Save the last searched city and weather data to local storage
        localStorage.setItem("lastSearchedCity", city);
        localStorage.setItem(
          "weatherData",
          JSON.stringify({
            cityDetails: data.city,
            myData: data.list[0].main,
            dataWeather: data.list[0].weather[0],
            windData: data.list[0].wind,
          })
        );

        if (response.status !== 200) {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error("SOmething went wrong", error);
    }
  };

  return (
    <div className="box">
      <div className="cityName">
        {cityName && (
          <p>
            {cityDetails.name}, {cityDetails.country}
            <a
              href={`https://en.wikipedia.org/wiki/${cityDetails.name}`}
              target="_ "
            >
              <img src={linkIcon} alt="link" />
            </a>
          </p>
        )}
        <div>{error && <span className="invalid">Invalid City Name</span>}</div>
        <div className="search">
          <input
            type="text"
            ref={inputValue}
            onKeyDown={onkeydownHandler}
            placeholder="City Name"
          />
          <img
            style={{ cursor: "pointer" }}
            onClick={onSubmitHandler}
            src={searchIcon}
            alt="searchIcon"
          />
        </div>
      </div>
      {cityName ? (
        <WeatherData
          weatherData={myData}
          weather={dataWeather}
          city={cityDetails}
          windData={windData}
        />
      ) : (
        <>
          <div className="blankData">
            Please Enter City Name See Weather Forcast
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;
