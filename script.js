const apiUrl = "https://api.teleport.org/api/continents/";

// Event listener for the submit button
document.getElementById("submit-button").addEventListener("click", function() {
  const query = document.getElementById("continent-search").value.trim();
  if (query) {
    const continentId = getContinentId(query);
    if (continentId) {
      fetchContinentData(continentId);
    } else {
      document.getElementById("results").innerHTML = "<p>Continent not found. Please enter a valid continent name.</p>";
    }
  }
});

function getContinentId(query) {
  const continents = {
    africa: "geonames:AF",
    antarctica: "geonames:AN",
    asia: "geonames:AS",
    europe: "geonames:EU",
    "north america": "geonames:NA",
    "south america": "geonames:SA",
    oceania: "geonames:OC"
  };
  return continents[query.toLowerCase()];
}

async function fetchContinentData(continentId) {
  try {
    const [continentInfoResponse, countriesResponse] = await Promise.all([
      fetch(`${apiUrl}${continentId}/`),
      fetch(`${apiUrl}${continentId}/countries/`)
    ]);

    const continentInfo = await continentInfoResponse.json();
    const countries = await countriesResponse.json();

    displayContinentInfo(continentInfo, countries);
  } catch (error) {
    console.error("Error fetching continent data:", error);
  }
}

function displayContinentInfo(continentInfo, countries) {
  const resultsDiv = document.getElementById("results");
  const countriesList = countries._links["continent:countries"].map(country => country.name).join(", ");

  resultsDiv.innerHTML = `
    <div class="section">
      <h2>${continentInfo.name}</h2>
      <p><strong>Population:</strong> ${continentInfo.population ? continentInfo.population.toLocaleString() : "Data not available"}</p>
    </div>
    <div class="section">
      <h3>Countries in ${continentInfo.name}</h3>
      <p>${countriesList}</p>
    </div>
    <div class="section">
      <h3>Overview</h3>
      <p>${continentInfo.description || "Description not available."}</p>
    </div>
  `;
}