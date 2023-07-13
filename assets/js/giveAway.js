/*=================logic to show breeds in dropdown===========*/
// Fetch the pet data from the JSON file
fetch("/assets/js/pets.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const breedsByType = {
      dog: getUniqueBreeds(data.dogs),
      cat: getUniqueBreeds(data.cats),
    };
    console.log(breedsByType);
    const animalTypeSelect = document.getElementById("animal-type");
    const breedSelect = document.getElementById("breed");

    animalTypeSelect.addEventListener("change", function () {
      const selectedType = animalTypeSelect.value;
      populateBreedsDropdown(breedsByType[selectedType]);
    });
  })
  .catch((error) => {
    console.error("Error fetching pet data: ", error);
  });

// Function to get unique breeds from the pet data
function getUniqueBreeds(pets) {
  const breeds = pets.map((pet) => pet.breed);
  console.log(breeds);
  return [...new Set(breeds)];
}

// Function to populate the breeds dropdown based on the selected animal type
function populateBreedsDropdown(breeds) {
  const breedSelect = document.getElementById("breed");
  console.log(breedSelect);
  // Clear existing options
  breedSelect.innerHTML = "";

  // Add a default placeholder option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select Breed";
  breedSelect.appendChild(defaultOption);

  // Loop through the breeds and create options for the dropdown
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.text = breed;
    breedSelect.appendChild(option);
  });
}
/*======================give away form====================*/
function handleGiveAwayFormSubmit(event) {
  event.preventDefault();

  const petTypeSelect = document.getElementById("animal-type");
  const breedSelect = document.getElementById("breed");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const petType = petTypeSelect.value;
  const breed = breedSelect.value;
  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;

  if (!validateForm(petType, breed, name, email, phone)) {
    return;
  }

  // Save the adoption details in IndexedDB
  saveGiveAwayDetails(petType, breed, name, email, phone);

  // Add pet type and breed details to JSON data
  addPetDetailsToJSON(petType, breed);

  // Clear form inputs
  petTypeSelect.value = "";
  breedSelect.innerHTML = '<option value="">Select</option>';
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
}

// Function to validate the form inputs
function validateForm(petType, breed, name, email, phone) {
  // Return true if validation succeeds, false otherwise
  if (
    petType === "" ||
    breed === "" ||
    name === "" ||
    email === "" ||
    phone === ""
  ) {
    console.error("Please fill in all the required fields.");
    return false;
  }

  return true;
}

// Function to save adoption details in IndexedDB
function saveGiveAwayDetails(petType, breed, name, email, phone) {
  // Code for saving adoption details in IndexedDB
  const giveAwayDetails = {
    petType: petType,
    breed: breed,
    name: name,
    email: email,
    phone: phone,
  };

  // Replace the code below with your actual IndexedDB saving logic
  // Example: Saving the adoptionDetails object to an object store
  const request = window.indexedDB.open("GiveAwayDB", 1);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore("giveAwayDetails", {
      keyPath: "id",
      autoIncrement: true,
    });
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("giveAwayDetails", "readwrite");
    const objectStore = transaction.objectStore("giveAwayDetails");
    const addRequest = objectStore.add(giveAwayDetails);

    addRequest.onsuccess = function () {
      console.log("Give away details saved successfully.");
    };

    addRequest.onerror = function () {
      console.error("Error saving give away details:", addRequest.error);
    };

    transaction.oncomplete = function () {
      db.close();
    };
  };

  request.onerror = function (event) {
    console.error("Error opening GiveAwayDB:", event.target.error);
  };
}

// Function to add pet details to the JSON data
function addPetDetailsToJSON(petType, breed) {
  // Fetch the existing JSON data
  fetch("/assets/js/pets.json")
    .then((response) => response.json())
    .then((data) => {
      // Add pet type and breed to the appropriate array
      if (petType === "dog") {
        data.dogs.push({ breed: breed });
      } else if (petType === "cat") {
        data.cats.push({ breed: breed });
      }

      // Save the updated JSON data
      return fetch("/assets/js/pets.json", {
        method: "PUT", // Replace with the appropriate HTTP method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    })
    .then((response) => {
      if (response.ok) {
        console.log("Pet details added to JSON data successfully.");
      } else {
        console.error("Error adding pet details to JSON data.");
      }
    })
    .catch((error) => {
      console.error("Error updating JSON data:", error);
    });
}

// Add event listener to the adoption form submit
const giveAwayForm = document.getElementById("give-away-form");
if (giveAwayForm) {
  giveAwayForm.addEventListener("submit", handleGiveAwayFormSubmit);
} else {
  console.error("element not found");
}
