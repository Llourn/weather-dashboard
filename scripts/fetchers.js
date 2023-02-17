const apiKey = "f0acb6d9e0139fb20b34cb331a5c0451";
let forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;

async function getWeather(lat, lon) {
  let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data);
  return data;
}

async function getCoords(cityName) {
  let limit = 15;
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  let response = await fetch(url);
  let data = [];
  if (response.ok) {
    data = await response.json();
  }

  console.log(data);
  return data;
}
// getWeather();

// const results = await getCoords("Fredericton");

export { getWeather, getCoords };
