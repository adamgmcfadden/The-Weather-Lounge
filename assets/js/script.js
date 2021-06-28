"use strict";

//open weather current weather end point
var currentEndPoint = "api.openweathermap.org/data/2.5/weather?";
// open weather 5 day forecast end point
var forecastEndPoint = "api.openweathermap.org/data/2.5/forecast?";
//my open weather API key
var apiKey = "&appid=20e4aa0aac33df74711bb16dd0d7a2b9";

//history of cities searched
var cityHistory = [];
//generate city name
$("#search-btn").on("click", function () {
  var cityName = $("#search-input").val();
  cityHistory.push(cityName);
  //fetch request
  fetch(
    "https://" + currentEndPoint + "q=" + cityName + "&units=metric" + apiKey
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon +
          apiKey
      )
        .then(function (newResponse) {
          return newResponse.json();
        })
        .then(function (newResponse) {
          console.log(newResponse);

          //reference weather-div id
          var currentWeatherDiv = $("#weather-div")
            .addClass("row border border-dark ml-1")
            .css("width", "97%");
          //check if positive or negative timeZone offset
          if (Math.sign(newResponse.timezone_offset) === -1) {
            var date = moment(
              newResponse.current.dt * 1000 - newResponse.timezone_offset * 1000
            ).format("MM/DD/YYYY");
          } else {
            var date = moment(
              newResponse.current.dt * 1000 + newResponse.timezone_offset * 1000
            ).format("MM/DD/YYYY");
          }
          // create <h2> element to hold City name, date and icon
          var currentWeatherEl = $("<h2></h2>").text(
            response.name + " (" + date + ")"
          );
          var iconImg = $("<img></img>")
            .attr(
              "src",
              "http://openweathermap.org/img/w/" +
                response.weather[0].icon +
                ".png"
            )
            .addClass("icon");
          currentWeatherDiv.append(currentWeatherEl, iconImg);

          //create <h3> element to hold information on selected city
          var currentDetails = $("<h3></h3>").text(
            "Temp: " + newResponse.current.temp + "°C"
          );

          //create <h3> element to hold information on selected city
          var currentDetails2 = $("<h3></h3>").text(
            "Wind: " +
              Math.round(newResponse.current.wind_speed * 3.6 * 100) / 100 +
              " km/h"
          );

          //create <h3> element to hold information on selected city
          var currentDetails3 = $("<h3></h3>").text(
            "Humidity: " + newResponse.current.humidity + " %"
          );

          var currentDetails4 = $("<h3></h3>").text(
            "UV Index: " + newResponse.current.uvi
          );
          currentWeatherEl.append(
            currentDetails,
            currentDetails2,
            currentDetails3,
            currentDetails4
          );
        });
    });
});
