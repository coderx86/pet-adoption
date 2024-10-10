const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
     .then((res) => res.json())
     .then((data) => displayCategories(data.categories))
     .catch((error) => console.log("error!"));
};
const loadPets = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
    .then((res) => res.json())
    .then((data) => {
        displayPets(data.pets);
        likedDisplayPetsContainer();
        sorting(data.pets);
    })
    .catch((error) => console.log("error!"));
}
const loadCategoryPets = (petsCategory) => {
    loadingSpinner(true);
    
    const minimumDelay = new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    const apiCall = fetch(`https://openapi.programming-hero.com/api/peddy/category/${petsCategory}`)
        .then((res) => res.json())
        .then(data => {
            removeActiveClass();
            const activeBtn = document.getElementById(`btn-${petsCategory}`);
            activeBtn.classList.add('rounded-full', 'bg-[#0e7a811a]', 'border-[#0E7A81]', 'border-2');
            displayPets(data.data);
            sorting(data.data);
        })
        .catch((error) => console.log("error!", error));

    Promise.all([minimumDelay, apiCall]).then(() => {
        loadingSpinner(false);
    });
};
const loadDetails = (petId) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    .then((res) => res.json())
    .then((data) => displayDetail(data.petData))
    .catch((error) => console.log("error!", error));
};

const sorting = (array) => {
    document.getElementById('sortByPriceBtn').addEventListener('click', () =>{
    const sortedPets = array.sort((a, b) => b.price - a.price);
    displayPets(sortedPets);
    })
}
const showCountDown = (petId) => {
    const button = document.getElementById(`pet_${petId}`);
    const showTimer = document.getElementById('count-down');
    showTimer.innerText = "3";
    let timer = 3;
    button.disabled = true;
    const interval = setInterval(() => {
        timer--;
        if (timer > 0) {
            showTimer.innerText = timer;
        } else {
            clearInterval(interval);
            document.getElementById('my_modal_2').close();
            button.innerText = "Adopted";
        }
    }, 1000);
}
const imageInserter = (link) => {
    console.log('clicked');
    const imageContainer = document.createElement('div');
    imageContainer.innerHTML = `
        <img src="${link}" alt="Pet Image" class="aspect-square object-cover rounded-lg">
    `;
    document.getElementById('liked-container').append(imageContainer); 
};
// displays detailed information about a pet within a modal
const displayDetail = (info) =>{
    const modalContainer = document.getElementById('my_modal_1');
    modalContainer.innerHTML = `
<div class="modal-box bg-white rounded-xl">
    <div>
        <div>
            <img class="sm:h-[220px] h-[160px] w-full rounded-lg object-cover mb-2" src="${info.image}" alt="">
        </div>
        <div>
            <div>
                <h2 class="text-2xl font-bold">${info.pet_name}</h2>
                <div class="flex gap-10">
                    <div>
                        <p class="text-[#131313b3]"><i class="fa-solid fa-shapes"></i> Breed: ${info.breed === undefined || info.breed === null ? 'Not available' : info.breed}</p>
                        <p class="text-[#131313b3]"><i class="fa-solid fa-venus-mars"></i> Gender: ${info.gender === undefined || info.gender === null ? 'Unknown' : info.gender}</p>
                        <p class="text-[#131313b3]"><i class="fa-solid fa-venus-mars"></i> Vaccinated status: ${info.vaccinated_status === undefined || info.vaccinated_status === null ? 'Not available' : info.vaccinated_status}</p>
                    </div>
                    <div>
                        <p class="text-[#131313b3]"><i class="fa-solid fa-calendar-days"></i> Birth: ${info.date_of_birth === undefined || info.date_of_birth === null ? 'Not available' : info.date_of_birth}</p>
                        <p class="text-[#131313b3]"><i class="fa-solid fa-dollar-sign"></i> Price: ${info.price}$</p>
                    </div>
                </div>
            </div>
            <hr class="my-2">
            <div>
                <h2 class="font-semibold mb-2">Details Information</h2>
                <p class="text-[#131313b3]">${info.pet_details}</p>
            </div>
        </div>
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-outline btn-success bg-[#0e7a811a] w-full mt-3">Close</button>
      </form>
    </div>
</div>
    `
}
const loadingSpinner = (show) => {
    if (show) {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('pets').classList.add('hidden');
    } else {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('pets').classList.remove('hidden');
    }
};
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("btn-category");
    console.log(buttons);
    for (let btn of buttons) {
      btn.classList.remove('rounded-full', 'bg-[#0e7a811a]', 'border-[#0E7A81]', 'border-2');
    }
  };
// creates and displays the liked pets container section
const likedDisplayPetsContainer = () =>{
    const likedPetsContainer = document.createElement('div');
    likedPetsContainer.classList.add('w-[25%]', 'border-2', 'rounded-xl', 'p-3');
    likedPetsContainer.innerHTML = `
    <div id="liked-container" class="grid grid-cols-1 lg:grid-cols-2 gap-3"></div>
    `
    document.getElementById('pets-container').append(likedPetsContainer);
}
// displays all pets in a grid layout, including their details and action buttons
const displayPets = (petImages) => {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML="";
    if (petImages.length == 0) {
        petsContainer.classList.remove("grid");
        petsContainer.innerHTML = `
        <div class="flex flex-col justify-center items-center bg-[#13131308] text-center rounded-3xl p-28">
            <img src="images/error.webp" alt="">
            <h1 class="font-extrabold text-4xl mt-6 mb-4">No Information Available</h1>
            <p class="max-w-[760px] text-[#131313b3] mx-auto">It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
             its layout. The point of using Lorem Ipsum is that it has a.</p>
        </div>
        `;
      } else {
        petsContainer.classList.add("grid");
      }
    petImages.forEach(item => {
        const petCard = document.createElement('div');
        petCard.classList.add('border-2', 'rounded-xl', 'p-3');
        petCard.innerHTML = `
        <img src="${item.image}" class="h-[160px] w-full rounded-lg mb-4 lg:mb-6 object-cover">
        <div>
            <div>
                <h3 class="text-xl font-bold">${item.pet_name}</h3>
                <p class="text-[#131313b3]"><i class="fa-solid fa-shapes"></i> Breed: ${item.breed === undefined || item.breed === null ? 'Not available' : item.breed}</p>
                <p class="text-[#131313b3]"><i class="fa-solid fa-calendar-days"></i> Birth: ${item.date_of_birth === undefined || item.date_of_birth === null ? 'Not available' : item.date_of_birth}</p>
                <p class="text-[#131313b3]"><i class="fa-solid fa-venus-mars"></i> Gender: ${item.gender === undefined || item.gender === null ? 'Unknown' : item.gender}</p>
                <p class="text-[#131313b3]"><i class="fa-solid fa-dollar-sign"></i> Price: ${item.price}$</p>
                <hr class="my-4">
            </div>
            <div class="flex justify-between">
                <button class="btn btn-outline btn-success p-3" onclick="imageInserter('${item.image}')"><i class="fa-regular fa-thumbs-up"></i></button>
                <button class="btn btn-outline btn-success font-bold p-3" onclick = "showCountDown(${item.petId}); my_modal_2.showModal()" id="pet_${item.petId}">Adopt</button>
                <button class="btn btn-outline btn-success font-bold p-2" onclick="loadDetails(${item.petId}); my_modal_1.showModal()">Details</button>
            </div>
        </div>
        `;
        petsContainer.append(petCard);
    });
}
// displays the categories of pets, each with a button to filter by that category
const displayCategories = (categories) => {
    const categoriesId = document.getElementById('categories');
    const sortContainer = document.createElement("div");

    categories.forEach(item => {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add('flex');
        buttonContainer.innerHTML = `
        <button id="btn-${item.category}" onclick="loadCategoryPets('${item.category}')" class="btn sm:text-2xl text-xl font-bold btn-outline border-gray-400 h-20 sm:w-[250px] w-[150px] mx-auto btn-category">
        <img class="size-10 sm:size-14" src="${item.category_icon}" alt="">${item.category}s</button>
        `;
        categoriesId.append(buttonContainer);
    });

    sortContainer.innerHTML = `
    <div class="flex justify-between items-center my-8">
    <h2 class="sm:text-2xl font-extrabold">Best Deal For you</h2>
    <button id="sortByPriceBtn" class="btn bg-[#0E7A81] sm:text-xl font-bold text-white">Sort by Price</button>
    </div>
    `;
    document.getElementById('categoriesContainer').append(sortContainer);
};

loadCategories();
loadPets();
