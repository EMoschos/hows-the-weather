//Displays the last searched item from Local storage when page is refreshed or closed and re-opened
lastSearched();

// Weatherbit.io AJAX Call - Return AJAX object
function callAPI(city) {
    var weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?key=125e5091a0b746d9a25859114793888d&days=6&country=au&city=" + city
    return $.ajax({
        url: weatherURL,
        method: "GET",
        success: function (data) {
        }
    })
}

//Function to add searches to the list and save the last search to local storage
function searchList(search) {
    var li = $("<li>");
    li.addClass("list-group-item");
    li.text(search);
    $(".list-group").prepend(li);
    localStorage.setItem("lastSearch", search);
}

//Function to display the weather from a searched or history listed city name.
function displayWeather(weatherData) {

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
    var uvIndex = Math.ceil(weatherData.data[0].uv);
    var uvMain = $("#uvMain");
    uvMain.text(" UV Index: " + uvIndex + " ");
    var bgColor = "background-color"

    if (uvIndex <= 2) {
        uvMain.css(bgColor, "Green");
    };
    if ((uvIndex >= 3) && (uvIndex <= 5)) {
        uvMain.css(bgColor, "gold");
    };
    if ((uvIndex >= 6) && (uvIndex <= 7)) {
        uvMain.css(bgColor, "orange");
    };
    if ((uvIndex >= 8) && (uvIndex <= 10)) {
        uvMain.css(bgColor, "red");
    };
    if (uvIndex > 10) {
        uvMain.css(bgColor, "purple");
    };

    //Weather Data that will populate the 5 day forecast cards run through a for loop.
    for (var i = 1; i < 6; i++) {
        $("#date" + i).text(weatherData.data[i].datetime);
        $("#icon" + i).attr("src", "./assets/icons/" + weatherData.data[i].weather.icon + ".png");
        $("#temp" + i).text("Temp: " + weatherData.data[i].max_temp + "\u2103");
        $("#humd" + i).text("Humidity: " + weatherData.data[i].rh + "%");
    }
};

//Function that displays the last searched item from Local storage when page is refreshed or closed and re-opened
function lastSearched() {
    var lastSearch = localStorage.getItem("lastSearch");
    console.log(lastSearch);

    callAPI(lastSearch).done(function (result) {
        console.log(result);
        searchList(lastSearch);
        displayWeather(result);
    });
};

//Search button click displays the current day and 5 day forecast from the user search input with no duplicate searches in the listing
var srcBtn = $("#srcBtn");
srcBtn.on("click", function () {
    event.preventDefault();
    var userSearch = $(this).prev().val().trim();

    callAPI(userSearch).done(function (result) {
        if (result) {
            $("li:contains(" + result.city_name + ")").each(function () {
                $(this).remove();
            });
            console.log(result);
            displayWeather(result);
            searchList(result.city_name);
        };
        if (typeof (result) === "undefined") {
            alert("Invalid search  - City spelling incorrect or not a city in database")
        }
    })
});

//History search click - Does not need Validation because it is performed in the search function
$(".list-group").on("click", ".list-group-item", function () {
    event.preventDefault();
    var histSearch = $(this).text();
    $(this).remove();
    callAPI(histSearch).done(function (result) {
        console.log(result);
        console.log(result.city_name);
        displayWeather(result);
        searchList(result.city_name);
    });
});