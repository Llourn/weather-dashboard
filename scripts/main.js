const apiKey = "f0acb6d9e0139fb20b34cb331a5c0451";
let forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;

function getweather(lat, lon) {
  let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
}

// getweather();

function getCoords(cityName) {
  let limit = 15;
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));
}

getCoords("Fredericton");
