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
	
	loadCharts();
	
	$(".tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
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
			console.log(data);
			console.log(data.city.name);
			
			// Parse through the json data and extract the necessary information to display in the page dynamically
			document.getElementById("cityName").innerHTML = data.city.name + ", " + data.city.country;
			
			replaceInnerHtml("weatherList", ""); // Clear the Weekly Forecast container
			
			for (i = 0; i < data.list.length; i++) {
				console.log(data.list[i]);
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


// Charts scripts

function loadCharts() {
	var ctx = document.getElementById("tempChart");
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "My First dataset",
					fill: true,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.3)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: [65, 59, 80, 81, 56, 55, 40],
					spanGaps: false,
				}
			]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	});
}