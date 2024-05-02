const recipeForm = document.getElementById('recipe-form');
const recipeName = document.getElementById('recipe-name');
const recipeIngredients = document.querySelector('#ingredients-table tbody');
const recipeMethod = document.getElementById('recipe-method');
const recipeItems = document.getElementById('recipe-items');

recipeForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const recipe = {
		name: recipeName.value,
		ingredients: [],
		method: recipeMethod.value
	};
	const ingredientRows = recipeIngredients.getElementsByTagName('tr');
	for (let i = 0; i < ingredientRows.length; i++) {
		const amount = ingredientRows[i].querySelector('.ingredient-amount').value;
		const name = ingredientRows[i].querySelector('.ingredient-name').value;
		recipe.ingredients.push(`${amount} ${name}`);
	}
	addRecipe(recipe);
    recipeForm.reset();
});

const addRecipe = (recipe) => {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    const recipeListItem = document.createElement('li');
    recipeListItem.innerHTML = `<strong>${recipe.name}</strong> - ${recipe.ingredients.join(', ')} - ${recipe.method}`;
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-danger', 'delete-recipe-btn');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        // Remove recipe from local storage
        const recipes = JSON.parse(localStorage.getItem('recipes'));
        const index = recipes.findIndex(r => r.name === recipe.name);
        if (index!== -1) {
            recipes.splice(index, 1);
            localStorage.setItem('recipes', JSON.stringify(recipes));
        }

        // Remove recipe from DOM
        recipeListItem.remove();
    });
    recipeListItem.appendChild(deleteButton);
    recipeItems.appendChild(recipeListItem);
};

const addIngredientButton = document.getElementById('add-ingredient');

addIngredientButton.addEventListener('click', () => {
	const newRow = document.createElement('tr');
    newRow.classList.add('ingredient-row');
	const amountCell = document.createElement('td');
	const nameCell = document.createElement('td');
	const amountInput = document.createElement('input');
	const nameInput = document.createElement('input');
    const deleteButton = document.createElement('button');
    const deleteCell = newRow.insertCell(-1);
	amountInput.type = 'text';
	amountInput.classList.add('ingredient-amount');
	amountInput.required = true;
	nameInput.type = 'text';
	nameInput.classList.add('ingredient-name');
	nameInput.required = true;
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-danger', 'delete-ingredient-btn');
    deleteButton.textContent = 'Delete';
	amountCell.appendChild(amountInput);
	nameCell.appendChild(nameInput);
	newRow.appendChild(amountCell);
	newRow.appendChild(nameCell);
	recipeIngredients.appendChild(newRow);
    deleteCell.appendChild(deleteButton);
    deleteButton.addEventListener('click', () => {
        const rowToRemove = deleteButton.closest('.ingredient-row');
        rowToRemove.remove();
    });
});

function addRecipeToList(recipe) {
    const recipeListItem = document.createElement('li');
    recipeListItem.innerHTML = `<strong>${recipe.name}</strong> - ${recipe.ingredients.join(', ')} - ${recipe.method}`;
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-danger', 'delete-recipe-btn');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteRecipe(recipe, recipeListItem);
    });
    recipeListItem.appendChild(deleteButton);
    recipeItems.appendChild(recipeListItem);
}

function deleteRecipe(recipe, listItem) {
    const recipes = JSON.parse(localStorage.getItem('recipes'));
    const index = recipes.findIndex(r => r.name === recipe.name);
    if (index !== -1) {
        recipes.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        listItem.remove();
    }
}

if (typeof Storage !== "undefined") {
    // Local storage can be used
} else {
    // Sorry! No Web Storage support..
    alert('Local storage is not supported by your browser. Please use try a different browser');
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});

function loadRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.forEach(recipe => {
        addRecipeToList(recipe);
    });
}

document.getElementById('download-recipes').addEventListener('click', function() {
    const recipes = localStorage.getItem('recipes');
    if (recipes) {
        const jsonString = JSON.stringify(JSON.parse(recipes), null, 2); // Beautify the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = "recipes.json";
        document.body.appendChild(a);
        a.click();

        // Clean up by removing the link and revoking the Blob URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert('No recipes to download!');
    }
});

document.getElementById('load-recipes').addEventListener('click', function() {
    const fileInput = document.getElementById('upload-recipes');
    const file = fileInput.files[0];

    if (file && file.type === "application/json") {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const recipes = JSON.parse(e.target.result);
                if (Array.isArray(recipes)) { // Check if it's an array of recipes
                    recipes.forEach(addRecipe);
                    alert('Recipes loaded successfully!');
                } else {
                    alert('Invalid file format: Expected an array of recipes.');
                }
            } catch (error) {
                alert('Error reading JSON: ' + error.message);
            }
        };

        reader.onerror = function() {
            alert('Failed to read file!');
        };

        reader.readAsText(file); // Read the file as text
    } else {
        alert('Please upload a valid JSON file.');
    }
});