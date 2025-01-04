// Product Management Logic
const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');

let products = [];

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const category = document.getElementById('productCategory').value;
  const stock = parseInt(document.getElementById('productStock').value);
  const reorderPoint = parseInt(document.getElementById('reorderPoint').value);

  const product = { name, category, stock, reorderPoint };
  products.push(product);

  renderProducts();
  productForm.reset();
});

function renderProducts() {
  productTableBody.innerHTML = '';

  products.forEach((product, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>${product.reorderPoint}</td>
      <td>
        <button class="action-btn edit" onclick="editProduct(${index})">Edit</button>
        <button class="action-btn delete" onclick="deleteProduct(${index})">Delete</button>
      </td>
    `;

    productTableBody.appendChild(row);
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  renderProducts();
}

function editProduct(index) {
  const product = products[index];

  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('reorderPoint').value = product.reorderPoint;

  deleteProduct(index);
}
