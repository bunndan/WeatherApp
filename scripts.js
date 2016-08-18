var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

$(document).ready(function() {
	getWeather();
	
	// Check for enter key being pressed when searching for a city
	document.getElementById("city").addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode == 13) {
			getWeather();
		}
	});
});

function getWeather() {
	// Default location is Toronto
	var cityName = document.getElementById("city").value;
	
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&units=metric&appid=5ca0cd82e4cf98eb5631457ba283f321";
	
	$.ajax({
		url: url,
		dataType: "json",
		data: { q: cityName },
		type: "GET",
		async: "false",
		success: function(data) {
			// Parse through the json data and extract the necessary information to display in the page dynamically
			document.getElementById("cityName").innerHTML = data.city.name + ", " + data.city.country;
			
			replaceInnerHtml("weatherList", ""); // Clear the Weekly Forecast container
			
			for (i = 0; i < data.list.length; i++) {
				// If it's today's information, update the main header section with extra data
				if (i == 0) {
					replaceInnerHtml ("cityTemp", Math.round(data.list[i].temp.day));
					replaceInnerHtml ("cityWeather", capitalizeFirstLetter(data.list[i].weather[0].description));
					replaceInnerHtml ("daytimeHigh", Math.round(data.list[i].temp.max));
					replaceInnerHtml ("daytimeLow", Math.round(data.list[i].temp.min));
					replaceInnerHtml ("wind", data.list[i].speed);
					replaceInnerHtml ("humidity", data.list[i].humidity);
					replaceInnerHtml ("pressure", Math.round(data.list[i].pressure));
					replaceInnerHtml ("cloudiness", capitalizeFirstLetter(data.list[i].weather[0].description));
					document.getElementById("weathericonMain").src="assets/" + data.list[i].weather[0].icon + ".png";
				} else {
					// Need to convert the Unix timestamp to day of the week
					var timestamp = data.list[i].dt;
					var a = new Date(timestamp * 1000);
					var dayOfWeek = days[a.getDay()];
					
					document.getElementById("weatherList").innerHTML += ""+
					"<div class='date-row'>"+
						"<h3 class='date-name'>" + dayOfWeek + "</h3>"+
						"<span class='date-weathericon'><img src='assets/" + data.list[i].weather[0].icon + ".png' alt='current weather'></span>"+
						"<h3 class='date-temperature'>" + Math.round(data.list[i].temp.day) + "&deg; / " + Math.round(data.list[i].temp.max) + "&deg;</h3>"+
					"</div>"+
					"<hr>";
				}
			}
		}
	});
}

// Cleans up the code a bit
function replaceInnerHtml (elementId, info) {
	document.getElementById(elementId).innerHTML = info;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
