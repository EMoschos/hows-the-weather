//New JS file
// var apiKey = "125e5091a0b746d9a25859114793888d"


//Search button click
var srcBtn = $("#srcBtn");
srcBtn.on("click", function () {
    event.preventDefault();
    var userSearch = $(this).prev().val().trim();
    console.log(userSearch);
    // weatherURL = weatherURL + userSearch;
    console.log("Clicked");

    var li = $("<li>")
    li.addClass("list-group-item")
    li.text(userSearch)
    $(".list-group").prepend(li)

    //Function for API CALL
    weatherCall(userSearch)
});

//History search click
$(".list-group").on("click", ".list-group-item", function(){
    event.preventDefault();
    var histSearch = $(this).text();
    console.log(histSearch)

    weatherCall(histSearch)
})


// This function is used to CALL the AJAX JSON
function weatherCall(search) {

    var weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?key=125e5091a0b746d9a25859114793888d&days=6&country=au&city=" + search;
    console.log(weatherURL)

    // Weatherbit.io AJAX Call
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (weatherData) {
        
        console.log(weatherData)
        
        //Get City Name and Date
        var cityName = weatherData.city_name;
        var currentDate = (weatherData.data[0].datetime);
        console.log(currentDate);
        $("#cityMain").text(cityName + " " + "(" + currentDate + ")");

        //Weather Icon - Icons stored in repo as "weatherbit.io" did not have URL links.
        var iconID = weatherData.data[0].weather.icon;
        console.log(iconID);
        var weatherIcon = "./assets/icons/" + iconID + ".png";
        $("#iconMain").attr("src", weatherIcon);
        console.log(weatherIcon);

        //Current day main display
        $("#tempMain").text("Temperature: " + weatherData.data[0].max_temp + "\u2103");
        $("#humdMain").text("Humidity: " + weatherData.data[0].rh + "%");
        $("#wsMain").text("Wind Speed: " + Math.ceil(weatherData.data[0].wind_spd * 3.6) + " km/h");
        $("#uvMain").text("UV Index: " + weatherData.data[0].uv);

        //Weather Data that will populate the 5 day forecast cards run through a for loop.
        for (var i = 1; i < 6; i++) {
            $("#date" + i).text(weatherData.data[i].datetime);
            $("#icon" + i).attr("src", "./assets/icons/" + weatherData.data[i].weather.icon + ".png");
            $("#temp" + i).text("Temp: " + weatherData.data[i].max_temp + "\u2103");
            $("#humd" + i).text("Humidity: " + weatherData.data[i].rh + "%");
        };
    })
};
