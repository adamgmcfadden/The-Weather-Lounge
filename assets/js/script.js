"use strict";

//open weather current weather end point
var currentEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
// open weather oneCall end
var oneCallEndPoint = "https://api.openweathermap.org/data/2.5/onecall?";
//my open weather API key
var apiKey = "&appid=20e4aa0aac33df74711bb16dd0d7a2b9";

//history of cities searched
var cityHistory = [];
//search button on click
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  //push input value to array
  var cityName = $("#search-input").val();
  cityHistory.push(cityName);
  //fetch request for current weather  by city name (using only for lat and lon to search in onecall endpoint)
  fetch(currentEndPoint + "q=" + cityName + "&units=metric" + apiKey)
    //convert response to JSON
    .then(function (response) {
      return response.json();
    })
    //fetch oneCall endpoint with lat and lon provided from first fetch
    .then(function (response) {
      console.log(response);
      fetch(
        oneCallEndPoint +
          "lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon +
          "&units=metric" +
          apiKey
      )
        //convert response to JSON
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
          // create <h2> element to hold City name and date
          var currentWeatherEl = $("<h2></h2>").text(
            response.name + " (" + date + ")"
          );
          // create icon image
          var iconImg = $("<img></img>")
            .attr(
              "src",
              "http://openweathermap.org/img/w/" +
                response.weather[0].icon +
                ".png"
            )
            .addClass("icon");
          //append <h2> and <img> to parent <div>
          currentWeatherDiv.append(currentWeatherEl, iconImg);

          //create <h3> element to hold current information on selected city
          var currentTemp = $("<h3></h3>").text(
            "Temp: " + newResponse.current.temp + "°C"
          );

          //create <h3> element to hold current information on selected city
          var currentWindSpeed = $("<h3></h3>").text(
            "Wind: " +
              Math.round(newResponse.current.wind_speed * 3.6 * 100) / 100 +
              " km/h"
          );

          //create <h3> element to hold current information on selected city
          var currentHumidity = $("<h3></h3>").text(
            "Humidity: " + newResponse.current.humidity + " %"
          );

          //create <h3> element to hold current information on selected city
          var currentUviIndex = $("<h3></h3>").text("UV Index: ");

          //create span element to hold uv index
          var uvSpan = $("<span></span>")
            .text(newResponse.current.uvi)
            .addClass("badge badge-pill");
          //append span to UVI details
          currentUviIndex.append(uvSpan);

          if (newResponse.current.uvi >= 0 && newResponse.current.uvi <= 2) {
            uvSpan.addClass("favourable");
          } else if (
            newResponse.current.uvi > 2 &&
            newResponse.current.uvi <= 5
          ) {
            uvSpan.addClass("moderate");
          } else if (
            newResponse.current.uvi > 5 &&
            newResponse.current.uvi <= 7
          ) {
            uvSpan.addClass("high");
          } else if (
            newResponse.current.uvi > 7 &&
            newResponse.current.uvi <= 10
          ) {
            uvSpan("severe");
          } else {
            uvSpan.addClass("extreme");
          }
          //append current information to <h2> element
          currentWeatherEl.append(
            currentTemp,
            currentWindSpeed,
            currentHumidity,
            currentUviIndex
          );

          //-------------------------------------------
          //reference forecasted time element
          var forecastWeatherDiv = $("#forecast-div");
          var forecastWeatherEl = $("<h2></h2>")
            .addClass("forecast-title")
            .text("5-Day Forecast:");

          forecastWeatherDiv.append(forecastWeatherEl);

          var cardEl = $("<div></div>").addClass("row card-container");

          forecastWeatherEl.append(cardEl);

          var currentIndexNumber = 1;
          for (let i = currentIndexNumber; i <= 5; i++) {
            //create card
            var cardDiv1 = $("<div></div>").addClass("card-style");
            // apply correct time offset
            if (Math.sign(newResponse.timezone_offset) === -1) {
              var date = moment(
                newResponse.daily[i].dt * 1000 -
                  newResponse.timezone_offset * 1000
              ).format("MM/DD/YYYY");
            } else {
              var date = moment(
                newResponse.daily[i].dt * 1000 +
                  newResponse.timezone_offset * 1000
              ).format("MM/DD/YYYY");
            }

            //create date element at top of card
            var cardDate1 = $("<h2></h2>").addClass("card-date").text(date);
            //create icon image inside card
            var cardIcon1 = $("<img></img")
              .attr(
                "src",
                "http://openweathermap.org/img/w/" +
                  newResponse.daily[i].weather[0].icon +
                  ".png"
              )
              .addClass("icon-card");

            var forecastTemp1 = $("<h3></h3>")
              .text("Temp: " + newResponse.daily[i].temp.max + "°C")
              .addClass("card-text");

            //create <h3> element to hold current information on selected city
            var forecastWindSpeed = $("<h3></h3>")
              .text(
                "Wind: " +
                  Math.round(newResponse.daily[i].wind_speed * 3.6 * 100) /
                    100 +
                  " km/h"
              )
              .addClass("card-text");

            //create <h3> element to hold current information on selected city
            var forecastHumidity = $("<h3></h3>")
              .text("Humidity: " + newResponse.daily[i].humidity + " %")
              .addClass("card-text");

            cardDiv1.append(
              cardDate1,
              cardIcon1,
              forecastTemp1,
              forecastWindSpeed,
              forecastHumidity
            );

            cardEl.append(cardDiv1);
            currentIndexNumber++;
          }
        });
    });
});
