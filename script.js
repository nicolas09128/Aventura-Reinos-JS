
import { Enemigos, JefeFinal } from './js/enemigos.js';
import { Jugadores } from './js/Jugadores.js';
import { Mercado } from './js/mercado.js';
import { batalla, categorizePlayers, mostrarRanking, mostrarReporteCompleto } from './js/Ranking.js';

const mercado = new Mercado();

/**
 * Devuelve la ruta de la imagen para un producto según su nombre o tipo.
 * Mapeo heurístico que intenta emparejar por palabras clave del nombre
 * y, si no encuentra, utiliza el tipo del producto.
 * @param {Object} producto - Producto con propiedades `nombre` y `tipo`.
 * @returns {string} Ruta relativa de la imagen a usar.
 */
function getProductImage(producto) {
    const name = (producto.nombre || '').toLowerCase();
    const tipo = (producto.tipo || '').toLowerCase();

    if (name.includes('espada')) return './img/espada.png';
    if (name.includes('hacha')) return './img/hacha.png';
    if (name.includes('escudo') || name.includes('escudo antiguo')) return './img/escudo.png';
    if (name.includes('legendario') && name.includes('escudo')) return './img/escudoRaro.png';
    if (name.includes('pocion')) return './img/Pocion.png';
    if (name.includes('revivir')) return './img/revivir.png';

    if (tipo === 'arma') return './img/espada.png';
    if (tipo === 'armadura') return './img/armadura.png';
    if (tipo === 'consumible') return './img/Pocion.png';

    return './img/p1.png';
}

var products = [];
function rebuildProductsFromMercado() {
    products = [];
    for (var i = 0; i < mercado.listaProductos.length; i++) {
        var producto = mercado.listaProductos[i];
        products.push({
            id: i + 1,
            name: producto.nombre,
            price: producto.precio,
            image: getProductImage(producto),
            type: producto.tipo,
            rareza: producto.rareza,
            bonus: producto.bonus,
            productoOriginal: producto
        });
    }
}
rebuildProductsFromMercado();


/**
 * Aplica un 20% de descuento a un producto aleatorio del mercado
 * y vuelve a renderizar la tienda para que se vea el nuevo precio.
 * No devuelve nada, actualiza el estado del `mercado` y la UI.
 * @returns {void}
 */
function applyRandomDiscount20() {
    const items = mercado.listaProductos;
    if (!items || items.length === 0) return;
    var idx = Math.floor(Math.random() * items.length);
    var producto = items[idx];
    producto.aplicarDescuento(20);

    rebuildProductsFromMercado();
    initializeShop();
    updateUI();

    try {
        alert('Se aplicó un 20% de descuento a: ' + producto.nombre + ' (nuevo precio: ' + (producto.precio).toFixed(2) + '€)');
    } catch (e) {
        console.log('Descuento aplicado a:', producto.nombre, 'nuevo precio:', producto.precio);
    }
}

var dineros = 500;
var gameState = {
    money: dineros,
    selectedProducts: [],
    purchasedProducts: [],
};

const player = new Jugadores('Atreus');

var enemies = [
    new Enemigos('Enemigo', 'Goblin', 20, 50),
    new Enemigos('Enemigo', 'Lobo', 30, 60),
    new Enemigos('Enemigo', 'Orco', 40, 80),
    new Enemigos('Enemigo', 'Demonio', 40, 90),
    new JefeFinal('Dragón', 55, 100, 'Llamarada', 2.0)
];

let selectedEnemy = null;
let enemiesQueue = []; 
let currentEnemyIndex = 0;

/**
 * Muestra la escena indicada ocultando las demás. Reinicia animaciones
 * y lanza efectos (confetti/emoji) en la escena final.
 * @param {string} id - ID del contenedor `.scene` a mostrar (por ejemplo 'scene-1').
 * @returns {void}
 */
function showScene(id) {
    var scenes = document.querySelectorAll('.scene');
    for (var i = 0; i < scenes.length; i++) {
        scenes[i].style.display = 'none';
    }
   
    if (id === 'scene-0') {
        const nameInput = document.getElementById('player-name-input');
        const atkInput = document.getElementById('player-attack');
        const defInput = document.getElementById('player-defense');
        const lifeInput = document.getElementById('player-life');
        if (nameInput) nameInput.value = '';
        if (atkInput) atkInput.value = '';
        if (defInput) defInput.value = '';
        if (lifeInput) lifeInput.value = '100';
    }
    if (id === 'monedero-entrada') {
            const mImg = document.getElementById('monedero-image');
            if(mImg) {
                mImg.classList.remove('slide-in-left');
                 void pImg.offsetWidth;
            }
        }

    const el = document.getElementById(id);
    if (el) {
        el.style.display = 'block';
        
       
        if (id === 'scene-5') {
            const pImg = document.getElementById('player-image-battle');
            const eImg = document.getElementById('enemy-image-battle');
            if (pImg) {
                pImg.classList.remove('slide-in-left');
                void pImg.offsetWidth; 
                pImg.classList.add('slide-in-left');
            }
            if (eImg) {
                eImg.classList.remove('slide-in-right');
                void eImg.offsetWidth;
                eImg.classList.add('slide-in-right');
            }
        }

        if (id === 'scene-6' && typeof confetti === 'function') {
            var puntos = player.puntos || 0;
            var categoria = puntos >= 90 ? 'pro' : 'rookie';
            if (categoria === 'rookie') {
                launchPoopEmojis();
            } else {
                confetti({ particleCount: 120, spread: 70, origin: { y: 0.35 } });
            }
        }
    } else {
        console.error('Elemento no encontrado:', id); 
    }
}

window.addEventListener('load', () => {
   
    initializeShop();
    initializeInventory();
    updateUI();

const playerCreationForm = document.getElementById('player-creation-form');

if (playerCreationForm) {
    playerCreationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let nombre = document.getElementById('player-name-input').value.trim();
        const ataque = parseInt(document.getElementById('player-attack').value) || 0;
        const defensa = parseInt(document.getElementById('player-defense').value) || 0;
        const vida = parseInt(document.getElementById('player-life').value) || 0;
        
        let errores = [];

        if (nombre === ""){ nombre = "Atreus";}
        if (ataque < 0) errores.push("El ataque no puede ser negativo.");
        if (defensa < 0) errores.push("La defensa no puede ser negativa.");
        if (vida < 100) errores.push("La vida mínima debe ser 100.");

        const totalStats = ataque + defensa + vida;
        if (totalStats > 110) {
            errores.push(`El total de estadísticas (${totalStats}) excede el límite de 110.`);
        }

        if (errores.length > 0) {
            alert("Errores:\n- " + errores.join("\n- "));
            return; 
        }

        player.nombre = nombre;
        player.nivelataque = ataque;
        player.defensa = defensa;
        player.vida = vida;
        player.vidaMaxima = vida;
        
        updateStatsDisplay();
        showScene('scene-1');
    });
}

    var toShopBtn = document.getElementById('to-shop-btn');
    if (toShopBtn) {
        toShopBtn.onclick = function() {
            applyRandomDiscount20();
            showScene('scene-2');
        };
    }
    document.getElementById('reset-btn').addEventListener('click', resetSelection);
    document.getElementById('buy-btn').addEventListener('click', processPurchase);
    document.getElementById('shop-continue-btn').addEventListener('click', () => { 
        updateUI(); 
        showScene('scene-3'); 
    });
    document.getElementById('to-battle-btn').addEventListener('click', () => {
        populateEnemySelector();
        showScene('scene-4');
    });
    document.getElementById('scene-4-continue-btn').addEventListener('click', startBattleSequence);
    document.getElementById('scene-4-back-btn').addEventListener('click', () => {
        showScene('scene-3');
    });
    document.getElementById('fight-btn').addEventListener('click', fight);
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            enemiesQueue = [];
            currentEnemyIndex = 0;
            showScene('scene-3');
        });
    }
    
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('restart-ranking-btn').addEventListener('click', restartGame);
    var tablaBtn = document.getElementById('tabla-btn');
    if (tablaBtn) {
        tablaBtn.onclick = function() {
            cargarRanking();
            showScene('scene-7');
        }
    }
    showScene('scene-0');
    updateStatsDisplay();
});

/**
 * Renderiza los productos en la tienda (crea las tarjetas y botones).
 * Se llama siempre que cambian los productos o sus precios.
 */
function initializeShop() {
    const shopContainer = document.getElementById('shop-container');
    shopContainer.innerHTML = '';

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    
    function displayProducts(productsToShow) {
        if (!productsToShow) productsToShow = products;
        productsGrid.innerHTML = '';
        for (var i = 0; i < productsToShow.length; i++) {
            var product = productsToShow[i];
            var productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.dataset.id = product.id;
            productElement.dataset.price = product.price;

            var bonusHtml = '';
            if (product.bonus && typeof product.bonus === 'object') {
                for (var k in product.bonus) {
                    if (Object.prototype.hasOwnProperty.call(product.bonus, k)) {
                        bonusHtml += '<span>' + k + ': +' + product.bonus[k] + '</span>';
                    }
                }
            } else {
                bonusHtml = String(product.bonus);
            }

            var btnText = gameState.selectedProducts.indexOf(product.id) !== -1 ? 'Retirar' : 'Añadir';
            productElement.innerHTML = 
                '<img src="' + product.image + '" alt="' + product.name + '" class="product-img">' +
                '<div class="product-name">' + product.name + '</div>' +
                '<div class="product-rareza">' + product.rareza + '</div>' +
                '<div class="product-price">' + (product.price).toFixed(2) + '€</div>' +
                '<div class="product-bonus">' + bonusHtml + '</div>' +
                '<div style="margin-top:8px;">' +
                '<button class="btn add-btn">' + btnText + '</button>' +
                '</div>';

            (function(prod, elem){
                var btn = elem.querySelector('.add-btn');
                if (btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        toggleProductSelection(prod.id);
                        if (gameState.selectedProducts.indexOf(prod.id) !== -1) {
                            elem.classList.add('added');
                            setTimeout(function(){ elem.classList.remove('added'); }, 900);
                        }
                        btn.textContent = (gameState.selectedProducts.indexOf(prod.id) !== -1) ? 'Retirar' : 'Añadir';
                    });
                }

                elem.addEventListener('click', function() {
                    toggleProductSelection(prod.id);
                    var btn2 = elem.querySelector('.add-btn');
                    if (btn2) btn2.textContent = (gameState.selectedProducts.indexOf(prod.id) !== -1) ? 'Retirar' : 'Añadir';
                });
            })(product, productElement);

            productsGrid.appendChild(productElement);
        }
    }

    shopContainer.appendChild(productsGrid);
    displayProducts(products);
}

/**
 * Crea los 8 slots del inventario en la UI (vacíos inicialmente).
 */
function initializeInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    inventoryContainer.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item empty';
        itemElement.id = `inventory-slot-${i}`;
        inventoryContainer.appendChild(itemElement);
    }
}

/**
 * Alterna la selección de un producto en la UI (añadir/retirar).
 * Actualiza el estado `gameState.selectedProducts` y la clase visual.
 * @param {number} productId - ID del producto a alternar
 */
function toggleProductSelection(productId) {
    const productElement = document.querySelector(`.product[data-id="${productId}"]`);
    const product = products.find(p => p.id === productId);
    if (!productElement) return;

    var idx = gameState.selectedProducts.indexOf(productId);
    if (idx !== -1) {
        gameState.selectedProducts.splice(idx, 1);
        productElement.classList.remove('selected');
    } else {
        if (canAffordProduct(product.price)) {
            gameState.selectedProducts.push(productId);
            productElement.classList.add('selected');
        }
    }
    updateUI();
}

/**
 * Comprueba si el jugador puede permitirse un producto teniendo en cuenta
 * los productos ya seleccionados.
 * @param {number} price - Precio del producto en céntimos
 * @returns {boolean}
 */
function canAffordProduct(price) {
    var totalSelectedPrice = 0;
    for (var i = 0; i < gameState.selectedProducts.length; i++) {
        var id = gameState.selectedProducts[i];
        for (var j = 0; j < products.length; j++) {
            if (products[j].id === id) {
                totalSelectedPrice += products[j].price;
                break;
            }
        }
    }
    return (totalSelectedPrice + price) <= gameState.money;
}

/**
 * Actualiza la interfaz: dinero, botones, inventario y estadísticas visibles.
 * Llama a funciones auxiliares para mantener la UI sincronizada con `gameState`.
 */
function updateUI() {
    var totalSelectedPrice = 0;
    for (var i = 0; i < gameState.selectedProducts.length; i++) {
        var sid = gameState.selectedProducts[i];
        for (var j = 0; j < products.length; j++) {
            if (products[j].id === sid) {
                totalSelectedPrice += products[j].price;
                break;
            }
        }
    }
    
    var dineroDisponible = gameState.money - totalSelectedPrice;
    document.getElementById('money-amount').textContent = `${(dineroDisponible).toFixed(2)}€`;

    for (var p = 0; p < products.length; p++) {
        var product = products[p];
        var productElement = document.querySelector('.product[data-id="' + product.id + '"]');
        if (!productElement) continue;
        var canAfford = (totalSelectedPrice + product.price <= gameState.money) || (gameState.selectedProducts.indexOf(product.id) !== -1);
        if (!canAfford && gameState.selectedProducts.indexOf(product.id) === -1) {
            productElement.classList.add('disabled');
        } else {
            productElement.classList.remove('disabled');
        }
        var btn = productElement.querySelector('.add-btn');
        if (btn) btn.textContent = (gameState.selectedProducts.indexOf(product.id) !== -1) ? 'Retirar' : 'Añadir';
    }

    const buyButton = document.getElementById('buy-btn');
    buyButton.disabled = gameState.selectedProducts.length === 0;

    updateInventoryDisplay();
    updateStatsDisplay();
}

/**
 * Deselecciona todos los productos seleccionados y actualiza la UI.
 */
function resetSelection() {
    gameState.selectedProducts = [];
    document.querySelectorAll('.product').forEach(p => p.classList.remove('selected'));
    updateUI();
}

/**
 * Procesa la compra de los productos seleccionados: descuenta dinero,
 * añade los objetos al inventario del jugador y actualiza la UI.
 */
function processPurchase() {
    if (gameState.selectedProducts.length === 0) return;

    const totalPrice = gameState.selectedProducts.reduce((total, id) => {
        const product = products.find(p => p.id === id);
        return total + (product ? product.price : 0);
    }, 0);
    
    if (totalPrice > gameState.money) return;
    
    gameState.money -= totalPrice;
    
    gameState.selectedProducts.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product && product.productoOriginal) {
            player.anadirObjeto(product.productoOriginal);
        }
    });
    
    gameState.purchasedProducts = [...gameState.purchasedProducts, ...gameState.selectedProducts];
    gameState.selectedProducts = [];
    
    updateUI();
    updateInventoryDisplay();
}

/**
 * Actualiza la visualización del inventario en las vistas de perfil y batalla.
 * Delegate en `updateInventoryInContainer` para cada contenedor.
 * @returns {void}
 */
function updateInventoryDisplay() {
    const inventoryContainer = document.getElementById('inventory-container');
    const battleInventoryContainer = document.getElementById('battle-inventory-container');
    
    updateInventoryInContainer(inventoryContainer);
    updateInventoryInContainer(battleInventoryContainer);
}

/**
 * Rellena un contenedor con la representación visual del inventario del jugador.
 * Se usa tanto en la escena de perfil como en el área de batalla.
 * @param {HTMLElement} container - Nodo donde insertar los items.
 */
function updateInventoryInContainer(container) {
    if (!container) return;

    if (!player.inventario || player.inventario.length === 0) {
        container.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const itemElement = document.createElement('div');
            itemElement.className = 'item empty';
            itemElement.id = `inventory-slot-${i}`;
            container.appendChild(itemElement);
        }
        return;
    }

    container.innerHTML = '';

    player.inventario.forEach((item, index) => {
        const itemSlot = document.createElement('div');
        itemSlot.className = 'item inventory-item';

        const imageSrc = getProductImage(item);

        itemSlot.innerHTML = `
            <img src="${imageSrc}" alt="${item.nombre}" class="inventory-item-img" title="${item.nombre}">
        `;

        container.appendChild(itemSlot);
    });
}

function updateStatsDisplay() {
    
    const stats = player.mostrar();

    const statsContainer = document.getElementById('player-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <h3>Estadísticas del Jugador</h3>
            <p>Nombre: ${stats.nombre}</p>
            <p>Vida: ${stats.vida}/${stats.vidaMaxima}</p>
            <p>Ataque: ${stats.ataque}</p>
            <p>Defensa: ${stats.defensa}</p>
            <p>Puntos: ${stats.puntos}</p>
            <p>Dinero: ${gameState.money}</p>
            <p>Inventario: ${player.inventario.length} objetos</p>
        `;
    }

    const enemyStats = document.getElementById('enemy-stats');
    if (enemyStats && selectedEnemy) {
        enemyStats.innerHTML = `
            <h3>Estadísticas del Enemigo</h3>
            <p>Nombre: ${selectedEnemy.nombre}</p>
            <p>Vida: ${selectedEnemy.puntosvida}</p>
            <p>Ataque: ${selectedEnemy.nivelataque}</p>
            ${selectedEnemy instanceof JefeFinal ? 
                `<p>Habilidad Especial: ${selectedEnemy.habilidadespecial}</p>
                 <p>Multiplicador de Daño: x${selectedEnemy.multiplicardanio}</p>` : ''}
        `;
    }

    const atk1 = document.getElementById('stat-attack-1');
    const def1 = document.getElementById('stat-defense-1');
    const life1 = document.getElementById('stat-life-1');
    const pts1 = document.getElementById('stat-points-1');
    const dn1 = document.getElementById('stat-dinero-1');
    const playerNameEl1 = document.getElementById('player-name-scene1');
    const playerNameEl3 = document.getElementById('player-name-scene3');
    const atk3 = document.getElementById('stat-attack-3');
    const def3 = document.getElementById('stat-defense-3');
    const life3 = document.getElementById('stat-life-3');
    const pts3 = document.getElementById('stat-points-3');
    const dn3 = document.getElementById('stat-dinero-3')
    if (playerNameEl1) playerNameEl1.textContent = player.nombre;
    if (playerNameEl3) playerNameEl3.textContent = player.nombre;
    if (atk1) atk1.textContent = player.nivelataque;
    if (def1) def1.textContent = player.defensa;
    if (life1) life1.textContent = `${stats.vida}/${stats.vidaMaxima}`;
    if (pts1) pts1.textContent = stats.puntos;
    if (dn1) dn1.textContent = gameState.money;
    if (atk3) atk3.textContent = player.ataqueTotal();
    if (def3) def3.textContent = player.defensaTotal();
    if (life3) life3.textContent = `${stats.vida}/${stats.vidaMaxima}`;
    if (pts3) pts3.textContent = stats.puntos;
    if (dn3) dn3.textContent = stats.dinero + gameState.money;
   
    const finalName = document.getElementById('final-player-name');
    const finalPoints = document.getElementById('final-points');
    const finalDinero = document.getElementById('final-dinero');
    if (finalName) finalName.textContent = player.nombre;
    if (finalPoints) finalPoints.textContent = player.puntos;
    if (finalDinero) finalDinero.textContent = stats.dinero + gameState.money;
    
    const monederoDisplay = document.getElementById('monedero');
    if (monederoDisplay) monederoDisplay.textContent = player.dinero + gameState.money;
    
    const finalCategoryEl = document.getElementById('final-player-category');
    if (finalCategoryEl) {
        const puntos = player.puntos || 0;
        const categoria = puntos >= 50 ? 'PRO' : 'ROOKIE';
        finalCategoryEl.textContent = categoria;
    }
}

/**
 * Crea una cola de 3 enemigos aleatorios y lanza la primera batalla.
 */
function startBattleSequence() {
    enemiesQueue = [];
    currentEnemyIndex = 0;
    
    for (let i = 0; i < 3; i++) {
        const randomIdx = Math.floor(Math.random() * enemies.length);
        enemiesQueue.push(enemies[randomIdx]);
    }
    
    loadNextEnemy();
}

/**
 * Carga el siguiente enemigo de la cola en la escena de batalla.
 */
function loadNextEnemy() {
    if (currentEnemyIndex >= enemiesQueue.length) {
        guardarResultado();
        setTimeout(() => { 
            showScene('scene-6'); 
            updateStatsDisplay(); 
        }, 1500);
        return;
    }
    
    selectedEnemy = enemiesQueue[currentEnemyIndex];
    setBattleEnemy(selectedEnemy);
    showScene('scene-5');
    updateBattleCounter();
}
/**
 * Actualizar contador de enemigos
 */
function updateBattleCounter() {
    const counter = document.getElementById('battle-counter');
    if (counter) {
        counter.textContent = `Enemigo ${currentEnemyIndex + 1}/3`;
    }
}

/**
 * Rellena la escena 4 con tarjetas visuales de los enemigos disponibles.
 * Es puramente informativa; la selección real de la cola de enemigos es aleatoria.
 */
function populateEnemySelector() {
    const selectorContainer = document.getElementById('enemy-selector');
    selectorContainer.innerHTML = '';

    enemies.forEach((enemy, index) => {
        const enemyCard = document.createElement('div');
        enemyCard.className = 'enemy-card';
        enemyCard.dataset.id = index;

        const enemyImage = getEnemyImage(enemy);
        const enemyInfo = `<p><strong>${enemy.nombre}</strong></p>
                          <p>⚔️ Ataque: ${enemy.nivelataque}</p>
                          <p>❤️ Vida: ${enemy.puntosvida}</p>`;

        enemyCard.innerHTML = `
            <img src="${enemyImage}" alt="${enemy.nombre}">
            ${enemyInfo}
        `;

        selectorContainer.appendChild(enemyCard);
    });
}

/**
 * Ajusta la UI para mostrar el `enemy` actual en batalla (imagen, nombre, etc.).
 * @param {Object} enemy - Enemigo que se asigna a la batalla.
 */
function setBattleEnemy(enemy) {
    selectedEnemy = enemy;
    const enemyImg = document.getElementById('enemy-image-battle');
    const enemyName = document.getElementById('enemy-name-battle');
    if (enemyImg) enemyImg.src = getEnemyImage(enemy);
    if (enemyName) enemyName.textContent = enemy.nombre;
    
    const battleWinner = document.getElementById('battle-winner');
    if (battleWinner) battleWinner.textContent = 'Ganador: -';
    
    const battleResult = document.getElementById('battle-result');
    if (battleResult) battleResult.textContent = '';
    
    document.getElementById('fight-btn').disabled = false;
    document.getElementById('fight-btn').style.display = 'inline-block';
    
    updateStatsDisplay();
}

/**
 * Devuelve la ruta de la imagen para un enemigo según su nombre.
 * @param {Object} enemy - Enemigo con propiedad `nombre`.
 * @returns {string} Ruta de la imagen.
 */
function getEnemyImage(enemy) {
    if (!enemy || !enemy.nombre) return './img/p1.png';
    const name = enemy.nombre.toLowerCase();
    if (name.includes('goblin')) return './img/Goblin.jpg';
    if (name.includes('lobo')) return './img/Lobo.jpg';
    if (name.includes('orco')) return './img/Orco.jpg';
    if (name.includes('demonio')) return './img/Demonio.jpg';
    if (name.includes('drag') || name.includes('dragón') || name.includes('dragon')) return './img/Dragon.jpg';
    return './img/p1.png';
}

/**
 * Ejecuta un turno de combate contra el `selectedEnemy` usando la función `batalla`.
 * Muestra el resultado en la UI y avanza la cola de enemigos o finaliza la partida.
 * @returns {void}
 */
function fight() {
    if (!selectedEnemy) return;
    
    const resultado = batalla(player, selectedEnemy);
    
    const resultMessage = document.getElementById('battle-result'); 
    const winnerElement = document.getElementById('battle-winner');
    const battlePointsEl = document.getElementById('battle-points');
    const dineroPoints = document.getElementById('battle-money');

    if (resultado.ganador === 'player') {
        if (resultMessage) {
            resultMessage.textContent = '¡Victoria! Has derrotado al enemigo';
            resultMessage.style.color = 'green';
        }
        if (winnerElement) winnerElement.textContent = `Ganador: ${player.nombre}`;
        if (battlePointsEl) battlePointsEl.textContent = player.puntos || 0;
        if (dineroPoints) dineroPoints.textContent = player.dinero + gameState.money || 0;
       
        lanzarMonedas();
        
        document.getElementById('fight-btn').disabled = true;
        currentEnemyIndex++;
        
        setTimeout(() => {
            loadNextEnemy();
        }, 1500);

    } else if (resultado.ganador === 'enemy') {
        if (resultMessage) {
            resultMessage.textContent = '¡Has sido derrotado!';
            resultMessage.style.color = 'red';
        }
        if (winnerElement) winnerElement.textContent = `Ganador: ${selectedEnemy.nombre}`;
        if (battlePointsEl) battlePointsEl.textContent = player.puntos || 0;
        if (dineroPoints) dineroPoints.textContent = gameState.money || 0;
      
        guardarResultado();
        setTimeout(() => { 
            showScene('scene-6'); 
            updateStatsDisplay(); 
        }, 1500);

    } else {
        if (resultMessage) {
            resultMessage.textContent = '¡Empate!';
            resultMessage.style.color = 'orange';
        }
        if (winnerElement) winnerElement.textContent = 'Ganador: Empate';
        if (battlePointsEl) battlePointsEl.textContent = player.puntos || 0;
        if (dineroPoints) dineroPoints.textContent = gameState.money || 0;
        document.getElementById('fight-btn').disabled = true;
        currentEnemyIndex++;
        
        setTimeout(() => {
            loadNextEnemy();
        }, 1500);
    }
    
    console.log(resultado.detalle);
    
    updateStatsDisplay();
    document.getElementById('fight-btn').disabled = true;
}
function guardarResultado() {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({
        nombre: player.nombre,
        puntos: player.puntos,
        dinero: gameState.money
    });
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function cargarRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    let tbody = document.querySelector('.ranking-table tbody');
    tbody.innerHTML = '';
    ranking.forEach((jugador, index) => {
        let fila = tbody.insertRow();
        fila.innerHTML = `<td>${index + 1}</td><td>${jugador.nombre}</td><td>${jugador.puntos}</td><td>${jugador.dinero}€</td>`;
    });
}
/**
 * Reinicia el estado del juego a valores iniciales: dinero, inventario, puntos,
 * cola de enemigos y vuelve a la escena principal.
 * @returns {void}
 */
function restartGame() {
    gameState.money = dineros;
    gameState.selectedProducts = [];
    gameState.purchasedProducts = [];
    
    player.puntos = 0;
    player.dinero = 0;
    player.vida = player.vidaMaxima;
    player.inventario = [];
    player.victorias = 0;
    
    selectedEnemy = null;
    enemiesQueue = [];
    currentEnemyIndex = 0;

    mercado.resetearPrecios();
    rebuildProductsFromMercado();

    initializeShop();
    initializeInventory();
    updateUI();
    updateStatsDisplay();
    showScene('scene-0');
}

/**
 * Lanza una animación de 3 monedas desde la parte superior de la pantalla.
 * Las monedas descienden hasta la mitad de la pantalla, giran y se desvanecen.
 * @returns {void}
 */
function lanzarMonedas() {
  
    const posiciones = [25, 50, 75];
    const monedas = posiciones.map((posX, index) => {
        return `<img src="./img/moneda.png" alt="moneda" class="moneda moneda-animacion" style="left: ${posX}%; animation-delay: ${index * 0.15}s;">`;
    }).join('');
    
    document.body.insertAdjacentHTML('beforeend', monedas);
    
    setTimeout(() => {
        const monedasElements = document.querySelectorAll('.moneda');
        monedasElements.forEach(moneda => moneda.remove());
    }, 3000);
}

/**
 * Crea y anima varios emojis (💩) que caen por la pantalla como efecto humorístico
 * usado en la escena final para jugadores 'rookie'. No devuelve nada.
 * @returns {void}
 */
function launchPoopEmojis() {
    const container = document.body;
    const poopEmoji = '💩';
    const duration = 3000; 
    const count = 30;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const poop = document.createElement('div');
            poop.textContent = poopEmoji;
            poop.style.position = 'fixed';
            poop.style.left = Math.random() * 100 + '%';
            poop.style.top = '-50px';
            poop.style.fontSize = (Math.random() * 20 + 30) + 'px';
            poop.style.opacity = '1';
            poop.style.pointerEvents = 'none';
            poop.style.zIndex = '9999';
            poop.style.animation = `fallDown ${Math.random() * 2 + 2}s linear forwards`;
            
            container.appendChild(poop);
            
            setTimeout(() => poop.remove(), (Math.random() * 2 + 2) * 1000);
        }, (i / count) * 500);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fallDown {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);