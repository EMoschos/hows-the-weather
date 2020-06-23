srcBtn.on("click", function () {
    event.preventDefault();
    userSearch = $(this).prev().val().trim();
    console.log(userSearch);

    // Weatherbit.io AJAX Call
    displayWeather(weatherData).then(function (weatherData) {
        //Get City Name and Date
        var cityName = weatherData.city_name;
        var currentDate = (weatherData.data[0].datetime);
        $("#cityMain").text(cityName + " " + "(" + currentDate + ")");

        //Weather Icon - Icons stored in repo as "weatherbit.io" did not have URL links.
        var iconID = weatherData.data[0].weather.icon;
        var weatherIcon = "./assets/icons/" + iconID + ".png";
        $("#iconMain").attr("src", weatherIcon);

        //Current day main display
        $("#tempMain").text("Temperature: " + weatherData.data[0].max_temp + "\u2103");
        $("#humdMain").text("Humidity: " + weatherData.data[0].rh + "%");
        $("#wsMain").text("Wind Speed: " + Math.ceil(weatherData.data[0].wind_spd * 3.6) + " km/h");

        //UV Index Color coding
        var uvIndex = Math.ceil(weatherData.data[0].uv)
        var uvMain = $("#uvMain")
        uvMain.text(" UV Index: " + uvIndex + " ");
        var bgColor = "background-color"

        if (uvIndex <= 2) {
            uvMain.css(bgColor, "Green")
        }
        if ((uvIndex >= 3) && (uvIndex <= 5)) {
            uvMain.css(bgColor, "gold")
        }
        if ((uvIndex >= 6) && (uvIndex <= 7)) {
            uvMain.css(bgColor, "orange")
        }
        if ((uvIndex >= 8) && (uvIndex <= 10)) {
            uvMain.css(bgColor, "red")
        }
        if (uvIndex > 10) {
            uvMain.css(bgColor, "purple")
        }

        //Weather Data that will populate the 5 day forecast cards run through a for loop.
        for (var i = 1; i < 6; i++) {
            $("#date" + i).text(weatherData.data[i].datetime);
            $("#icon" + i).attr("src", "./assets/icons/" + weatherData.data[i].weather.icon + ".png");
            $("#temp" + i).text("Temp: " + weatherData.data[i].max_temp + "\u2103");
            $("#humd" + i).text("Humidity: " + weatherData.data[i].rh + "%");
        }
    }


    console.log(weatherData)
    if (weatherData) {

        searchList(weatherData.city_name)
    };
    if (typeof (weatherData) === "undefined") {
        alert("Invalid search  - City spelling incorrect or not a city in database")
    }
})
});

function displayWeather(weatherData) {
    var weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?key=125e5091a0b746d9a25859114793888d&days=6&country=au&city=" + userSearch
    return $.ajax({
        url: weatherURL,
        method: "GET"
    })
}