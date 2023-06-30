// display meals card according to search
function displayMealList() {
  let inputValue = document.getElementById("search").value;
  let array = JSON.parse(localStorage.getItem("favList"));
  let api = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let page = "";
  let meals = getMealFromApi(api, inputValue);
  meals.then((data) => {
    if (data.meals) {
      data.meals.forEach((element) => {
        let isFav = false;
        for (let i = 0; i < array.length; i++) {
          if (array[i] == element.idMeal) {
            isFav = true;
          }
        }
        if (isFav) {
          page += `
          <div id="itemCard" class="itemCard" style="width: 20rem;">
              <img src="${element.strMealThumb}" class="itemCard-img-top" alt="...">
              <div class="itemCard-body">
                  <h5 class="itemCard-title">${element.strMeal}</h5>
                  <div class="itemCard-more-fav">
                      <button type="button" class="btn" onclick="displayMealDetails(${element.idMeal})">More Details</button>
                      <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                  </div>
              </div>
          </div>
          `;
        } else {
          page += `
          <div id="itemCard" class="itemCard" style="width: 20rem;">
              <img src="${element.strMealThumb}" class="itemCard-img-top" alt="...">
              <div class="itemCard-body">
                  <h5 class="itemCard-title">${element.strMeal}</h5>
                  <div class="itemCard-more-fav">
                      <button type="button" class="btn" onclick="displayMealDetails(${element.idMeal})">More Details</button>
                      <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                  </div>
              </div>
          </div>
          `;
        }
      });
    } else {
      page += `
        <div class="item-not-found">
            <div class="container">
                <div class="lead">
                    Not found
                </div>
            </div>
        </div>
        `;
    }
    document.getElementById("main").innerHTML = page;
  });
}

// Function to fetch meal suggestions based on input value
function fetchMealSuggestions(inputValue) {
  let api = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let suggestions = getMealFromApi(api, inputValue);
  suggestions.then((data) => {
    if (data.meals) {
      let suggestionsList = document.getElementById("suggestions-list");
      suggestionsList.innerHTML = ""; // Clear previous suggestions

      data.meals.forEach((meal) => {
        let suggestionItem = document.createElement("li");
        suggestionItem.textContent = meal.strMeal;
        suggestionItem.addEventListener("click", () => {
          document.getElementById("search").value = meal.strMeal;
          document.getElementById("suggestions-list").innerHTML = ""; // Clear suggestions after selection
          displayMealList();
        });
        suggestionsList.appendChild(suggestionItem);
      });

      suggestionsList.style.display = "block"; // Show the suggestions
    } else {
      document.getElementById("suggestions-list").innerHTML = ""; // Clear suggestions if no matching meals
    }
  });
}

// Add event listener to search input for auto-suggestions
document.getElementById("search").addEventListener("input", (event) => {
  let inputValue = event.target.value;
  fetchMealSuggestions(inputValue);
});

// Add event listener to handle clicks outside the suggestions list
document.addEventListener("click", (event) => {
  let suggestionsList = document.getElementById("suggestions-list");
  if (!suggestionsList.contains(event.target)) {
    suggestionsList.innerHTML = ""; // Clear suggestions if clicked outside
  }
});

//displays full meal details
async function displayMealDetails(id) {
  let api = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let page = "";
  await getMealFromApi(api, id).then((data) => {
    page += `
      <div id="mealdetails" class="mb-5">
        <div id="mealheader">
          <div id="meal-img">
            <img src="${data.meals[0].strMealThumb}" alt="" srcset="">
          </div>
          <div id="details">
            <h3>${data.meals[0].strMeal}</h3>
            <h6>Category : ${data.meals[0].strCategory}</h6>
            <h6>Area : ${data.meals[0].strArea}</h6>
          </div>
        </div>
        <div id="mealinstruction">
          <h5 class="text-center">Instruction :</h5>
          <p>${data.meals[0].strInstructions}</p>
        </div>
        <div class="text-center">
          <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
        </div>
      </div>
    `;
  });
  document.getElementById("main").innerHTML = page;
}

//all favourite meals in favourites section
async function displayFavtMealList() {
  let array = JSON.parse(localStorage.getItem("favList"));
  let api = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let page = "";
  if (array.length == 0) {
    page += `
      <div class="item-not-found">
        <div class="container">
          <div class="lead">
            Empty!.
          </div>
        </div>
      </div>
    `;
  } else {
    for (let i = 0; i < array.length; i++) {
      await getMealFromApi(api, array[i]).then((data) => {
        page += `
          <div id="itemCard" class="itemCard" style="width: 20rem;">
            <img src="${data.meals[0].strMealThumb}" class="itemCard-img-top" alt="...">
            <div class="itemCard-body">
              <h5 class="itemCard-title">${data.meals[0].strMeal}</h5>
              <div class="itemCard-more-fav">
                <button type="button" class="btn btn-outline-light" onclick="displayMealDetails(${data.meals[0].idMeal})">More Details</button>
                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
              </div>
            </div>
          </div>
        `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = page;
}

// check if fav meal present in local storage if not make fav list array
if (localStorage.getItem("favList") == null) {
  localStorage.setItem("favList", JSON.stringify([]));
}

// it fetches and return meals from api
async function getMealFromApi(api, value) {
  const response = await fetch(`${api + value}`);
  const meals = await response.json();
  return meals;
}

//this function is to add and remove meals to/from favourites list
function addRemoveToFavList(id) {
  let array = JSON.parse(localStorage.getItem("favList"));
  let isPresent = false;
  for (let i = 0; i < array.length; i++) {
    if (id == array[i]) {
      isPresent = true;
    }
  }
  if (isPresent) {
    let num = array.indexOf(id);
    array.splice(num, 1);
    alert("Meal removed from favourite list");
  } else {
    array.push(id);
    alert("Meal added to favourite list");
  }
  localStorage.setItem("favList", JSON.stringify(array));
  displayMealList();
  displayFavtMealList();
}

// Add event listener to search input for auto-suggestions and Enter key press
document.getElementById("search").addEventListener("input", (event) => {
  let inputValue = event.target.value;
  fetchMealSuggestions(inputValue);
});

document.getElementById("search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    displayMealList();
  }
});

// Add event listener to search input for auto-suggestions and Enter key press
document.getElementById("search").addEventListener("input", (event) => {
  let inputValue = event.target.value;
  fetchMealSuggestions(inputValue);
});

document.getElementById("search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    displayMealList();
    document.getElementById("suggestions-list").innerHTML = ""; // Clear suggestions
    document.getElementById("suggestions-list").style.display = "none"; // Hide suggestions
  }
});

// Reset or refresh the page when the cancel button (x) is clicked in the search bar
document.getElementById("search").addEventListener("search", function () {
  location.reload(); // Reload the page
});
