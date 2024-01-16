import React from "react";
import searchIcon from "../assets/search.svg";

const WeatherSearchForm = ({ inputValue, handleSearch }) => {
  const onkeydownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
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
  );
};

export default WeatherSearchForm;
