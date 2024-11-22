document.addEventListener('DOMContentLoaded', async function () {
    const productosCatalogo = document.getElementById('productosCatalogo');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const favFilterBtn = document.getElementById('favFilterBtn');
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';

    let cocktails = []; // Almacena los productos cargados desde la API
    let isShowingFavorites = false; // Estado para saber si se está mostrando solo favoritos

    // Función para cargar productos desde la API
    async function cargarProductos() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            cocktails = data.drinks; // Guardar los datos en la variable global
            mostrarProductos(cocktails);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productosCatalogo.innerHTML = '<p>No se pudieron cargar los cócteles. Intenta más tarde.</p>';
        }
    }

    // Función para mostrar productos en el catálogo
    function mostrarProductos(productos) {
        productosCatalogo.innerHTML = ''; // Limpiar catálogo antes de mostrar

        // Filtrar los productos si estamos mostrando solo favoritos
        const productosAMostrar = isShowingFavorites ? productos.filter(cocktail => isFavorite(cocktail.idDrink)) : productos;

        productosAMostrar.forEach(cocktail => {
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

        asignarEventos(); // Volver a asignar eventos a los botones
    }

    // Función para manejar la búsqueda
    function buscarProductos(event) {
        event.preventDefault(); // Evitar que el formulario recargue la página
        const terminoBusqueda = searchInput.value.toLowerCase();
        const resultados = cocktails.filter(cocktail =>
            cocktail.strDrink.toLowerCase().includes(terminoBusqueda)
        );

        if (resultados.length > 0) {
            mostrarProductos(resultados);
        } else {
            productosCatalogo.innerHTML = '<p>No se encontraron cócteles que coincidan con tu búsqueda.</p>';
        }
    }

    // Función para cambiar el estado del filtro de favoritos
    function toggleFavoriteFilter() {
        isShowingFavorites = !isShowingFavorites;
        favFilterBtn.innerText = isShowingFavorites ? '💖' : '🤍';
        mostrarProductos(cocktails);
    }

    // Funciones auxiliares para favoritos
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

    // Asignar eventos
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

    // Función para agregar al carrito
    function handleAddToCartButton(event) {
        const button = event.target;
        const product = {
            id: button.getAttribute('data-id'),
            name: button.getAttribute('data-name'),
            price: parseFloat(button.getAttribute('data-price')),
            image: button.getAttribute('data-image'),
        };
        addToCart(product);
    }

    // Funciones para el carrito
    function getCartItems() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    function saveCartItems(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }

    function addToCart(product) {
        let cartItems = getCartItems();
        cartItems.push(product);
        saveCartItems(cartItems);
        updateCartCount();
        showNotification(`${product.name} ha sido agregado al carrito`);
    }

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
        const notification = document.createElement('div');
        notification.classList.add('alert', 'alert-success');
        notification.textContent = message;
        container.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 1000);
        }, 3000);
    }

    // Inicializar eventos
    searchForm.addEventListener('submit', buscarProductos); // Asignar evento de búsqueda al formulario
    favFilterBtn.addEventListener('click', toggleFavoriteFilter); // Asignar evento al filtro de favoritos
    cargarProductos();

    updateCartCount(); // Inicializar la cuenta de productos en el carrito
});
