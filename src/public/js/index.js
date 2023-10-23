(function () {
    const socket = io();

    socket.on('actualizarProductos', (productos) => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; 
    
        productos.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `<h2>${product.title}</h2>
                            <h4>${product.description}</h4>
                            <p><strong>Precio: </strong>${product.price}</p>
                            <p><strong>Imagen: </strong>${product.thumbnail}</p>
                            <p><strong>Codigo: </strong>${product.code}</p>
                            <p><strong>Stock: </strong>${product.stock}</p>`;
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = `Eliminar ${product.title}`;
            deleteButton.className = 'delete-button';
            deleteButton.setAttribute('data-productid', product.id);
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            li.appendChild(deleteButton);
    
            productList.appendChild(li);
        });
    });

    const productList = document.getElementById('product-list');
        productList.addEventListener('click', (event) => {
            if (event.target && event.target.matches('.delete-button')) {
                const productId = event.target.getAttribute('data-productid');
                    if (productId) {
                        if (confirm('¿Seguro que deseas eliminar este producto?')) {
                            fetch(`/api/products/${productId}`, {
                                method: 'DELETE'
                            })
                            .then(response => {
                                if (response.ok) {
                                    socket.emit('eliminarProducto', productId);
                                } else {
                                    console.error('Error al eliminar el producto.');
                                }
                            })
                            .catch(error => {
                                console.error('Error al eliminar el producto:', error);
                            });
                        }
                    }
            }
    });
    
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(productForm);
        const newProduct = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            thumbnail: formData.get('thumbnail'),
            code: formData.get('code'),
            stock: parseInt(formData.get('stock')),
        };

        socket.emit('agregarProducto', newProduct);
    });


})();
