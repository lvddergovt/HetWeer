const baseApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${config.apiKey}&units=metric`;

// Define all interactable items
const SELECTORS = {
	searchButton: document.getElementById('searchBtn'),
	errorMessage: document.getElementById('errorMessage'),
	cityInput: document.getElementById('cityInput'),
};

// Define weather object properties
const weatherData = {
	location: document.getElementById('location'),
	temperature: document.getElementById('temperature'),
	windspeed: document.getElementById('windSpeed'),
	conditions: document.getElementById('conditions'),
  weatherIcon: document.getElementById("weatherIcon")
};

// Document loaded
document.addEventListener('DOMContentLoaded', function () {
	// Look for location in localstorage
	// if it exists, use this city in a fetch call
	if (localStorage.getItem('location')) {
		let savedLocation = localStorage.getItem('location');
		const url = `${baseApiUrl}&q=${savedLocation}`;

		fetchAndSetWeatherData(url);
	} else {
		// Try get user's current location
		setWeatherFromUserLocation();
	}

   // Listen to button click for user input
		SELECTORS.searchButton.addEventListener('click', function () {
			setWeatherFromUserInput();
			SELECTORS.cityInput.value = '';
		});

});


SELECTORS.cityInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    SELECTORS.searchButton.click();
  }
}); 

const setWeatherFromUserInput = () => {
	const url = `${baseApiUrl}&q=${SELECTORS.cityInput.value}`;
	fetchAndSetWeatherData(url);
};

const setWeatherFromUserLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			let lon = position.coords.longitude;
			let lat = position.coords.latitude;

			// API url with lat/long parameters instead of city name
			const url = `${baseApiUrl}&lat=${lat}&lon=${lon}`;

			// Call the API
			fetchAndSetWeatherData(url);
		});
	}
};



const fetchAndSetWeatherData = (url) => {
	SELECTORS.errorMessage.innerHTML = '';
  console.log('hoi')

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			setWeatherResultData(data);
		})
		.catch((err) => {
			SELECTORS.errorMessage.innerHTML =
				'De ingevoerde plaats kon niet worden gevonden, controleer de spelling en probeer het opnieuw.';
		});
};


// This method uses the fetched weather data to set the weather properties in HTML
const setWeatherResultData = (data) => {
	const { main, name, weather } = data;

  const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
    weather[0]["icon"]
  }.svg`;

  weatherData.weatherIcon.src = icon;
	weatherData.location.innerHTML = name;
	weatherData.conditions.innerHTML = weather[0].description;
	weatherData.temperature.innerHTML = `${Math.round(main.temp)}&deg;`;
  
};

const saveLocation = () => {
	window.localStorage.setItem('location', weatherData.location.innerHTML);
}