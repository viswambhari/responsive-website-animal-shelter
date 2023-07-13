/*===========================pet list generator========================*/

// Function to generate table rows for pets
function generatePetTableRow(pet) {
  const row = document.createElement("tr");

  // Create table cells for each pet property
  const nameCell = document.createElement("td");
  nameCell.textContent = pet.name;
  row.appendChild(nameCell);

  const breedCell = document.createElement("td");
  breedCell.textContent = pet.breed;
  row.appendChild(breedCell);

  const ageCell = document.createElement("td");
  ageCell.textContent = pet.age;
  row.appendChild(ageCell);

  return row;
}

// Function to populate the pets table
function populatePetsTable(pets) {
  const petsTableBody = document.getElementById("pets-table-body");

  // Clear existing table rows
  petsTableBody.innerHTML = "";

  // Loop through the pet data and create table rows
  pets.forEach((pet) => {
    const row = generatePetTableRow(pet);
    petsTableBody.appendChild(row);
  });
}

// Button event listeners
const toggleCatsButton = document.getElementById("toggle-cats-button");
const toggleDogsButton = document.getElementById("toggle-dogs-button");

toggleCatsButton.addEventListener("click", function () {
  fetch("/assets/js/pets.json")
    .then((response) => response.json())
    .then((data) => {
      populatePetsTable(data.cats);
    })
    .catch((error) => {
      console.error("Error fetching pet data: ", error);
    });
});

toggleDogsButton.addEventListener("click", function () {
  fetch("/assets/js/pets.json")
    .then((response) => response.json())
    .then((data) => {
      populatePetsTable(data.dogs);
    })
    .catch((error) => {
      console.error("Error fetching pet data: ", error);
    });
});
