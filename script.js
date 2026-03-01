/* HUERTA URBANA - LOGIC & CART SYSTEM (Catalogo Extendido) */

const PRODUCTS = {
    combos: [
        { id: 'c1', name: 'Combo Inicial', price: 35000, desc: 'Básico: Mezcla de verduras y frutas esenciales.', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300' },
        { id: 'c2', name: 'Combo Familiar', price: 65000, desc: 'Pensado para 4 personas (mamá, papá y dos hijos).', img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=300' },
        { id: 'c3', name: 'Combo Premium', price: 95000, desc: 'Mezcla de todas las verduras, frutas, frutos secos y miel.', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300' },
        { id: 'c4', name: 'Combo Frutos Secos', price: 42000, desc: '100% frutos secos, miel, granola y pasas de uva.', img: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=300' },
        { id: 'c5', name: 'Combo Fit', price: 58000, desc: 'Orientado a personas que hacen gimnasio (Proteína y Energía).', img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=300' },
        { id: 'c6', name: 'Combo Semanal', price: 32000, desc: 'Tamaño para 1-2 personas, por 7 días.', img: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300' },
        { id: 'c7', name: 'Combo Mensual', price: 120000, desc: 'Tamaño familia, mezcla variada de todos los productos.', img: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=300' },
        { id: 'c8', name: 'Combo Llena la Heladera', price: 85000, desc: 'Mezcla de todas las frutas y verduras disponibles, tamaño grande.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300' }
    ],
    individual: {
        'verduras': [
            { id: 'v1', name: 'Tomate', price: 3500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v2', name: 'Lechuga Mantecosa', price: 2800, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v3', name: 'Papa Blanca', price: 1500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v4', name: 'Cebolla Blanca', price: 1800, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v5', name: 'Cebolla Morada', price: 2100, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v6', name: 'Zanahoria', price: 1600, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v7', name: 'Morrón Rojo', price: 4500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v8', name: 'Pepino', price: 2200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v9', name: 'Calabaza Cabutía', price: 1900, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v10', name: 'Calabaza Anco', price: 1700, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v11', name: 'Acelga', price: 2400, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v12', name: 'Espinaca', price: 3200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v13', name: 'Remolacha', price: 2600, unit: 'kg', step: 0.5, min: 1 }
        ],
        'frutas': [
            { id: 'f1', name: 'Manzana Roja', price: 4200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f2', name: 'Manzana Verde', price: 4600, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f3', name: 'Bananas', price: 3800, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f4', name: 'Naranja', price: 3200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f5', name: 'Limón', price: 2500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f6', name: 'Mandarina', price: 3000, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f7', name: 'Bandejita de Arándanos', price: 3500, unit: 'un', step: 1, min: 1 },
            { id: 'f8', name: 'Durazno', price: 5500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f9', name: 'Pomelo', price: 3400, unit: 'kg', step: 0.5, min: 1 }
        ],
        'frutos-secos-extras': [
            { id: 's1', name: 'Mix Frutos Secos', price: 18000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 's2', name: 'Nueces', price: 22000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 's3', name: 'Almendras', price: 24000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 's4', name: 'Maní', price: 8000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 's5', name: 'Castañas de Cajú', price: 28000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 's6', name: 'Granola', price: 12000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 's7', name: 'Pasas de Uva', price: 9000, unit: 'g', step: 50, min: 100, max: 1000 },
            { id: 'ex1', name: 'Miel Pura', price: 7500, unit: 'kg', step: 0.5, min: 1 }
        ]
    }
};

const MIN_PURCHASE = 45000;
let cart = {};
let activeCategory = 'verduras';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    renderCombos();
    renderCustomProducts();
    updateSummary();
});

function initUI() {
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', handleOrderSubmit);
}

function switchCategory(cat) {
    activeCategory = cat;
    // Update tabs UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(cat));
    });
    renderCustomProducts();
}

function renderCombos() {
    const combosContainer = document.getElementById('combos-container');
    combosContainer.innerHTML = PRODUCTS.combos.map(combo => `
        <div class="combo-card">
            <img src="${combo.img}" alt="${combo.name}" class="combo-img">
            <div class="combo-info">
                <h3>${combo.name}</h3>
                <p>${combo.desc}</p>
                <div class="combo-price-row">
                    <span class="price">$${combo.price.toLocaleString('es-AR')}</span>
                    <div class="qty-control">
                        <button type="button" class="qty-btn" onclick="updateComboQty('${combo.id}', -1)"><ion-icon name="remove-circle-outline"></ion-icon></button>
                        <span class="qty-val" id="qty-combo-${combo.id}">0</span>
                        <button type="button" class="qty-btn" onclick="updateComboQty('${combo.id}', 1)"><ion-icon name="add-circle-outline"></ion-icon></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCustomProducts() {
    const container = document.getElementById('custom-products-container');
    const prods = PRODUCTS.individual[activeCategory];

    container.innerHTML = prods.map(prod => {
        const cartItem = cart[prod.id] || { qty: 0 };
        return `
            <div class="product-item">
                <div class="product-details">
                    <h4>${prod.name}</h4>
                    <span>$${prod.price.toLocaleString('es-AR')} / ${prod.unit}</span>
                </div>
                <div class="qty-control">
                    <button type="button" class="qty-btn" onclick="updateCustomQty('${prod.id}', -1, '${activeCategory}')"><ion-icon name="remove-outline"></ion-icon></button>
                    <span class="qty-val" id="qty-prod-${prod.id}">${cartItem.qty}</span>
                    <button type="button" class="qty-btn" onclick="updateCustomQty('${prod.id}', 1, '${activeCategory}')"><ion-icon name="add-outline"></ion-icon></button>
                </div>
            </div>
        `;
    }).join('');
}

function updateComboQty(id, delta) {
    const combo = PRODUCTS.combos.find(c => c.id === id);
    if (!cart[id]) {
        cart[id] = { ...combo, qty: 0, type: 'combo' };
    }

    cart[id].qty += delta;
    if (cart[id].qty < 0) cart[id].qty = 0;

    document.getElementById(`qty-combo-${id}`).innerText = cart[id].qty;
    if (cart[id].qty === 0) delete cart[id];

    updateSummary();
}

function updateCustomQty(id, delta, category) {
    const prod = PRODUCTS.individual[category].find(p => p.id === id);
    if (!cart[id]) {
        cart[id] = { ...prod, qty: 0, type: 'custom' };
    }

    const currentQty = cart[id].qty;
    const step = prod.step;
    const min = prod.min;

    if (delta > 0) {
        if (currentQty === 0) {
            cart[id].qty = min;
        } else {
            cart[id].qty += step;
        }
    } else {
        if (currentQty <= min) {
            cart[id].qty = 0;
        } else {
            cart[id].qty -= step;
        }
    }

    // Limit max for nuts
    if (prod.max && cart[id].qty > prod.max) cart[id].qty = prod.max;

    document.getElementById(`qty-prod-${id}`).innerText = cart[id].qty;
    if (cart[id].qty === 0) delete cart[id];

    updateSummary();
}

function updateSummary() {
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');
    const badge = document.getElementById('cart-total-badge');
    const minMsg = document.getElementById('min-purchase-msg');
    const submitBtn = document.getElementById('submit-btn');

    let total = 0;
    let itemsHtml = '';

    const cartEntries = Object.values(cart);

    if (cartEntries.length === 0) {
        itemsHtml = '<p class="empty-msg">Tu carrito está vacío</p>';
    } else {
        cartEntries.forEach(item => {
            // Precio para frutos secos es por kg en la BD, pero se vende en g
            let itemPrice = item.price;
            let subtotal = 0;

            if (item.unit === 'g') {
                subtotal = (itemPrice / 1000) * item.qty;
            } else {
                subtotal = itemPrice * item.qty;
            }

            total += subtotal;
            itemsHtml += `
                <div class="summary-item">
                    <span>${item.name} (${item.qty}${item.unit})</span>
                    <span>$${subtotal.toLocaleString('es-AR')}</span>
                </div>
            `;
        });
    }

    summaryItems.innerHTML = itemsHtml;
    summaryTotal.innerText = `$${Math.round(total).toLocaleString('es-AR')}`;
    badge.innerText = `$${Math.round(total).toLocaleString('es-AR')}`;

    if (total >= MIN_PURCHASE) {
        minMsg.style.color = '#27ae60';
        minMsg.innerText = '✅ Cupo mínimo alcanzado';
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-disabled');
    } else {
        minMsg.style.color = '#e74c3c';
        minMsg.innerText = `Compra mínima: $${MIN_PURCHASE.toLocaleString('es-AR')}`;
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');
    }
}

function handleOrderSubmit(e) {
    e.preventDefault();

    const orderData = {
        cliente: {
            nombre: document.getElementById('fullname').value,
            direccion: document.getElementById('address').value,
            telefono: document.getElementById('phone').value,
            diaEntrega: document.getElementById('delivery-day').value,
            rangoHorario: document.getElementById('delivery-time').value
        },
        pedido: Object.values(cart).map(item => ({
            producto: item.name,
            cantidad: `${item.qty}${item.unit}`,
            precioUnitario: item.price,
            subtotal: item.unit === 'g' ? (item.price / 1000) * item.qty : item.price * item.qty
        })),
        total: Math.round(Object.values(cart).reduce((acc, curr) => {
            const sub = curr.unit === 'g' ? (curr.price / 1000) * curr.qty : curr.price * curr.qty;
            return acc + sub;
        }, 0)),
        fecha: new Date().toISOString()
    };

    console.log('--- PEDIDO RECIBIDO (JSON) ---');
    console.log(JSON.stringify(orderData, null, 2));

    document.getElementById('success-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
    cart = {};
    document.getElementById('order-form').reset();
    renderCombos();
    renderCustomProducts();
    updateSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
