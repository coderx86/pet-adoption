const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
     .then((res) => res.json())
     .then((data) => displayCatagories(data.categories))
     .catch((error) => console.log("error!"));
};

const displayCatagories = (catagories) => {
    const categoriesId = document.getElementById('categories');
    const sortContainer = document.createElement("div");
    catagories.forEach(item => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add('flex')
    buttonContainer.innerHTML = `
    <button id="btn-${item.category}" onclick="loadCategoryVideos(${item.category})" class="btn text-2xl font-bold btn-outline border-gray-400 h-20 w-[250px] mx-auto"><img src="${item.category_icon}" alt="">${item.category}s</button>
    `
    categoriesId.append(buttonContainer);
});
    sortContainer.innerHTML = `
    <div class="flex justify-between my-8">
    <h2 class="text-2xl font-bold">Best Deal For you</h2>
    <button class="btn bg-[#0E7A81] text-xl font-bold text-white">Sort by Price</button>
    </div>
    `
    document.getElementById('categoriesContainer').append(sortContainer);
}

loadCategories();