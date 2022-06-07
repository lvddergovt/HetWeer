const baseApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${config.apiKey}&units=metric`;

// Define all interactable items
const SELECTORS = {
	searchButton: document.querySelector('#searchBtn'),
	errorMessage: document.querySelector('#errorMessage'),
	inputValue: document.querySelector('#cityInput').value,
};

// Define weather object properties
const weatherData = {
	location: document.querySelector('#location'),
	temperature: document.querySelector('#temperature'),
	windspeed: document.querySelector('#windSpeed'),
	conditions: document.querySelector('#conditions'),
};

// Document loaded
document.addEventListener('DOMContentLoaded', function () {
	// Look for location in localstorage
	// if it exists, use this city in a fetch call
	if (localStorage.getItem('location') != null) {
		let savedLocation = localStorage.getItem('location');
		const url = `${baseApiUrl}&q=${savedLocation}`;

		fetchAndSetWeatherData(url);
	} else {
		// Try get user's current location
		getWeatherFromUserLocation();

    // Listen to button click for user input
		SELECTORS.searchButton.addEventListener('click', function () {
			console.log(SELECTORS.inputValue);
			getWeatherFromUserInput();
			SELECTORS.inputValue = '';
		});
	}
});



const getWeatherFromUserInput = () => {
	const url = `${baseApiUrl}&q=${SELECTORS.inputValue}`;
	fetchAndSetWeatherData(url);
};

const getWeatherFromUserLocation = () => {
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


const setWeatherResultData = (data) => {
	const { main, name, weather } = data;

	weatherData.location.innerHTML = `Het weer in <span>${name}<span>`;
	weatherData.conditions.innerHTML = weather[0].description;
	weatherData.temperature.innerHTML = `${Math.round(main.temp)}&deg;C`;

	window.localStorage.setItem('location', name);
};
