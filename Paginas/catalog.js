document.addEventListener('DOMContentLoaded', async function () {
    const productosCatalogo = document.getElementById('productosCatalogo');
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';

    // Función para cargar productos desde la API
    async function cargarProductos() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const cocktails = data.drinks;

            // Generar dinámicamente las tarjetas de productos
            cocktails.forEach(cocktail => {
                const col = document.createElement('div');
                col.classList.add('col-lg-4', 'col-md-6', 'mb-4');

                col.innerHTML = `
                    <div class="card">
                        <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="${cocktail.strDrink}">
                        <div class="card-body">
                            <h5 class="card-title">${cocktail.strDrink}</h5>
                            <p class="card-text">Disfruta de un delicioso cóctel preparado con ingredientes frescos.</p>
                            <button class="btn btn-primary add-to-cart-button" 
                                data-id="${cocktail.idDrink}" 
                                data-name="${cocktail.strDrink}" 
                                data-price="150" 
                                data-image="${cocktail.strDrinkThumb}">
                                Agregar al carrito
                            </button>
                            <button class="fav-btn" data-id="${cocktail.idDrink}">🤍</button>
                        </div>
                    </div>
                `;
                productosCatalogo.appendChild(col);
            });

            // Asignar eventos a botones después de cargar productos
            asignarEventos();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productosCatalogo.innerHTML = '<p>No se pudieron cargar los cócteles. Intenta más tarde.</p>';
        }
    }

    // Función para obtener los productos del localStorage
    function getCartItems() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    // Función para guardar los productos en el localStorage
    function saveCartItems(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }

    // Función para agregar un producto al carrito
    function addToCart(product) {
        let cartItems = getCartItems();
        cartItems.push(product);
        saveCartItems(cartItems);
        updateCartCount();
        showNotification(`${product.name} ha sido agregado al carrito`);
    }    

    // Función para actualizar la cuenta de productos en el carrito
    function updateCartCount() {
        const cartItems = getCartItems();
        document.getElementById('cart-count').textContent = cartItems.length;
    }

    function showNotification(message) {
        const container = document.getElementById('notificationContainer');
    
        if (!container) {
            console.warn('El contenedor de notificaciones no existe.');
            return;
        }
    
        // Crear un nuevo elemento de notificación
        const notification = document.createElement('div');
        notification.classList.add('alert', 'alert-success');
        notification.textContent = message;
    
        // Agregar la notificación al contenedor
        container.appendChild(notification);
    
        // Configurar la desaparición de la notificación
        setTimeout(() => {
            notification.classList.add('fade-out'); // Clase opcional para animar la salida
            setTimeout(() => {
                notification.remove();
            }, 1000); // Tiempo adicional para que termine la animación
        }, 3000);
    }
    

    // Función para manejar el evento de agregar al carrito
    function handleAddToCartButton(event) {
        const button = event.target;
        const product = {
            id: button.getAttribute('data-id'),
            name: button.getAttribute('data-name'),
            price: parseFloat(button.getAttribute('data-price')),
            image: button.getAttribute('data-image')
        };
        addToCart(product);
    }

    // Funciones para manejar favoritos
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function addFavorite(productId) {
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            saveFavorites();
        }
    }

    function removeFavorite(productId) {
        favorites = favorites.filter(id => id !== productId);
        saveFavorites();
    }

    function isFavorite(productId) {
        return favorites.includes(productId);
    }

    function updateFavoriteButton(button, isFav) {
        button.innerText = isFav ? '💖' : '🤍';
    }

    // Asignar eventos a los botones de carrito y favoritos
    function asignarEventos() {
        document.querySelectorAll('.add-to-cart-button').forEach(button => {
            button.addEventListener('click', handleAddToCartButton);
        });

        document.querySelectorAll('.fav-btn').forEach(button => {
            const productId = button.dataset.id;

            updateFavoriteButton(button, isFavorite(productId));

            button.addEventListener('click', () => {
                if (isFavorite(productId)) {
                    removeFavorite(productId);
                    updateFavoriteButton(button, false);
                } else {
                    addFavorite(productId);
                    updateFavoriteButton(button, true);
                }
            });
        });
    }

    // Inicializar la cuenta de productos en el carrito
    updateCartCount();

    // Cargar productos desde la API
    cargarProductos();
});
