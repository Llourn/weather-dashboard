const apiKey = "f0acb6d9e0139fb20b34cb331a5c0451";

async function fetchWeather(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data);
  return data;
}

async function fetchForecast(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  let response = await fetch(url);
  let data = await response.json();

  console.log(data);
  return data;
}

async function fetchCoords(cityName) {
  let limit = 15;
  let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  let response = await fetch(url);
  let data = [];
  if (response.ok) {
    data = await response.json();
  }

  console.log(data);
  return data;
}

export { fetchForecast, fetchCoords, fetchWeather };
