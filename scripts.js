// Weather App script - Brandon Ma 2016

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
	
	$(".tabs-menu span").click(function(event) {
		event.preventDefault();
		$(this).parent().addClass("current");
		$(this).parent().siblings().removeClass("current");
		var tab = $(this).attr("data");
		$(".tab-content").not("#"+tab).css("display", "none");
		$("#"+tab).fadeIn();
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
			
			// Arrays to store data for chart generation
			var temperatureArray = [];
			var windArray = [];
			var humidityArray = [];
			var pressureArray = [];
			var dayOfTheWeekArray = [];
			
			for (var i = 0; i < data.list.length; i++) {
				console.log(data.list[i]);
				
				// Need to convert the Unix timestamp to day of the week
				var timestamp = data.list[i].dt;
				var a = new Date(timestamp * 1000);
				var dayOfTheWeek = days[a.getDay()];
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
					document.getElementById("weatherList").innerHTML += ""+
					"<div class='date-row'>"+
						"<h3 class='date-name'>" + dayOfTheWeek + "</h3>"+
						"<span class='date-weathericon'><img src='assets/" + data.list[i].weather[0].icon + ".png' alt='current weather'></span>"+
						"<h3 class='date-temperature'>" + Math.round(data.list[i].temp.day) + "&deg; / " + Math.round(data.list[i].temp.max) + "&deg;</h3>"+
					"</div>"+
					"<hr>";
				}
				
				// Append array data
				temperatureArray.push(Math.round(data.list[i].temp.day));
				windArray.push(data.list[i].speed);
				humidityArray.push(data.list[i].humidity);
				pressureArray.push(Math.round(data.list[i].pressure));
				dayOfTheWeekArray.push(dayOfTheWeek);
			}
			// Load the charts
			resetCanvas("temperature");
			resetCanvas("wind");
			resetCanvas("humidity");
			resetCanvas("pressure");
			loadCharts(temperatureArray, "temperatureChart", dayOfTheWeekArray, "Temperature", "189, 143, 11");
			loadCharts(windArray, "windChart", dayOfTheWeekArray, "Wind", "60, 191, 241");
			loadCharts(humidityArray, "humidityChart", dayOfTheWeekArray, "Humidity", "90, 255, 126");
			loadCharts(pressureArray, "pressureChart", dayOfTheWeekArray, "Pressure", "255, 42, 42");
			
			// Find the average values of each set of data
			var temperatureAvg = 0;
			for(var i = 0; i < temperatureArray.length; i++ ){
				temperatureAvg += temperatureArray[i];
			}
			temperatureAvg = Math.round(temperatureAvg/temperatureArray.length * 10) / 10;
			replaceInnerHtml("temperatureAvg", "Average Temp: " + temperatureAvg + "&deg; C");
			var windAvg = 0;
			for(var i = 0; i < windArray.length; i++ ){
				windAvg += windArray[i];
			}
			windAvg = Math.round(windAvg/windArray.length * 10) / 10;
			replaceInnerHtml("windAvg", "Average Wind: " + windAvg + " m/s");
			var humidityAvg = 0;
			for(var i = 0; i < humidityArray.length; i++ ){
				humidityAvg += humidityArray[i];
			}
			humidityAvg = Math.round(humidityAvg/humidityArray.length * 10) / 10;
			replaceInnerHtml("humidityAvg", "Average Humidity: " + humidityAvg + " %");
			var pressureAvg = 0;
			for(var i = 0; i < pressureArray.length; i++ ){
				pressureAvg += pressureArray[i];
			}
			pressureAvg = Math.round(pressureAvg/pressureArray.length * 10) / 10;
			replaceInnerHtml("pressureAvg", "Average Pressure: " + pressureAvg + " hPa");
		}
	});
}

// Cleans up code redundancy a bit
function replaceInnerHtml (elementId, info) {
	document.getElementById(elementId).innerHTML = info;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Charts scripts
function loadCharts(chartData, idName, dayOfTheWeekArray, chartLabel, chartColor) {
	var ctx = document.getElementById(idName);
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dayOfTheWeekArray,
			datasets: [
				{
					label: chartLabel,
					fill: true,
					lineTension: 0.1,
					backgroundColor: "rgba("+chartColor+",0.3)",
					borderColor: "rgba("+chartColor+",1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba("+chartColor+",1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba("+chartColor+",1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: chartData,
					spanGaps: false,
				}
			],
			scaleFontColor: "rgba("+chartColor+",1)"
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: "#CCC"
					}
				}],
				xAxes: [{
					ticks: {
						fontColor: "#CCC"
					}
				}]
			},
			legend: {
				display: false,
			}
		}
	});
}

// Destroy the charts.js canvas so the hover doesn't scan any previous data points
function resetCanvas (data) {
	$('#'+data+'Chart').remove();
	$('#'+data+'Tab').append('<canvas id="'+data+'Chart"><canvas>');
};
