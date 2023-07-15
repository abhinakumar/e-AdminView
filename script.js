// Keep track of the products and total value
let products = [];
let totalValue = 0;

// CRUD API endpoint
const apiUrl = 'https://crudcrud.com/api/fb12900993654c87ad877202da400af6/data';
// Function to fetch all products from the API
async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    products = data;
    calculateTotalValue();
    renderProducts();
  } catch (error) {
    console.log('Error fetching products:', error);
  }
}

// Function to add a product
async function addProduct(name, price) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        price: price
      })
    });
    const data = await response.json();
    products.push(data);

    // Update the total value
    calculateTotalValue();

    // Update the DOM
    renderProducts();
    updateTotalValue();
  } catch (error) {
    console.log('Error adding product:', error);
  }
}

// Function to delete a product
async function deleteProduct(index) {
  const productId = products[index]._id;

  try {
    await fetch(`${apiUrl}/${productId}`, {
      method: 'DELETE'
    });

    // Retrieve the product to be deleted
    const product = products[index];

    // Update the total value
    totalValue -= product.price;

    // Remove the product from the list
    products.splice(index, 1);

    // Update the DOM
    renderProducts();
    updateTotalValue();
  } catch (error) {
    console.log('Error deleting product:', error);
  }
}

// Function to calculate the total value
function calculateTotalValue() {
  totalValue = products.reduce((sum, product) => sum + product.price, 0);
}

// Function to render the products in the DOM
function renderProducts() {
  const productsContainer = document.getElementById('productsContainer');
  productsContainer.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const productElement = document.createElement('div');
    productElement.classList.add('product');
    
    updateTotalValue();
    productElement.innerHTML = `
      <span class="product-name">${product.name}</span>
      <span class="product-price">$${product.price}</span>    
      <button class="delete-button" onclick="deleteProduct(${i})">Delete</button>
    `;
    productsContainer.appendChild(productElement);
  }
}

// Function to update the total value display
function updateTotalValue() {
  const totalValueElement = document.getElementById('totalValue');
  totalValueElement.textContent = `Total Value: $${totalValue}`;
}

// Fetch initial products from the API
fetchProducts();

// Handle form submission
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const productNameInput = document.getElementById('productName');
  const productPriceInput = document.getElementById('productPrice');

  const productName = productNameInput.value;
  const productPrice = parseInt(productPriceInput.value);

  addProduct(productName, productPrice);

  // Reset the form inputs
  productNameInput.value = '';
  productPriceInput.value = '';
});

