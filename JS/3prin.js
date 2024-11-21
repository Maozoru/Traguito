document.addEventListener('DOMContentLoaded', function () {
    const productosDestacadosRow = document.getElementById('productosDestacadosRow');

    // URL de la API para obtener cócteles aleatorios
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

    // Función para obtener y mostrar cócteles aleatorios
    async function mostrarCoctelesAleatorios() {
        try {
            // Limpia el contenedor
            productosDestacadosRow.innerHTML = '';

            // Solicita 3 cócteles aleatorios
            for (let i = 0; i < 3; i++) {
                const response = await fetch(url);
                const data = await response.json();

                // Obtén el cóctel
                const drink = data.drinks[0];

                // Crea la tarjeta del cóctel
                const col = document.createElement('div');
                col.classList.add('col-md-4');

                const card = document.createElement('div');
                card.classList.add('card', 'shadow-sm', 'mb-4');

                const img = document.createElement('img');
                img.src = drink.strDrinkThumb;
                img.classList.add('card-img-top');
                img.alt = drink.strDrink;

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = drink.strDrink;

                const cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = drink.strInstructions || 'No hay descripción disponible.';

                // Botón que redirige al catálogo
                const link = document.createElement('a');
                link.href = `Paginas/catalogo.html?drink=${encodeURIComponent(drink.strDrink)}`; // Redirige a catalogo.html con un parámetro
                link.classList.add('btn', 'btn-primary', 'btn-block');
                link.textContent = 'Más info';

                // Ensambla la tarjeta
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(link);

                card.appendChild(img);
                card.appendChild(cardBody);

                col.appendChild(card);

                // Agrega la tarjeta al contenedor
                productosDestacadosRow.appendChild(col);
            }
        } catch (error) {
            console.error('Error al cargar los cócteles:', error);
        }
    }

    // Llama a la función al cargar la página
    mostrarCoctelesAleatorios();
});
