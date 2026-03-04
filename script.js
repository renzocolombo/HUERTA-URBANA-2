/* HUERTA URBANA - LOGIC & CART SYSTEM (Catalogo Extendido) */

const PRODUCTS = {
    combos: [
        {
            id: 'c1', name: 'Combo básico', price: 35000,
            desc: 'Mezcla esencial de frutas y verduras para arrancar la semana con energía y frescura.',
            img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
            items: ['2kg Papa blanca', '1kg Cebolla blanca', '1kg Tomate', '1/2kg Lechuga mantecosa', '1kg Manzana roja', '1kg Naranja']
        },
        {
            id: 'c2', name: 'Combo familiar', price: 65000,
            desc: 'Pensado para cubrir las necesidades de una familia, con frutas y verduras frescas para todos los días.',
            img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=300',
            items: ['4kg Papa blanca', '2kg Cebolla blanca', '2kg Tomate', '1kg Lechuga mantecosa', '1kg Zanahoria', '1kg Calabaza anco', '2kg Manzana roja', '2kg Naranja', '1kg Banana']
        },
        {
            id: 'c3', name: 'Combo premium', price: 95000,
            desc: 'Selección exclusiva de productos premium, con sabores y calidad superior para quienes buscan lo mejor.',
            img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300',
            items: ['Productos de Estación Premium', 'Variedad de Frutas Seleccionadas', 'Frutos Secos 250g', 'Miel Pura 1kg']
        },
        {
            id: 'c4', name: 'Combo frutos secos', price: 42000,
            desc: 'Mezcla de frutos secos y miel, ideal para un snack nutritivo y delicioso.',
            img: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=300',
            items: ['Frutos Secos Mix 500g', 'Miel Pura 1kg']
        },
        {
            id: 'c5', name: 'Combo fit', price: 58000,
            desc: 'Orientado a personas que hacen ejercicio, rico en proteínas y energía natural para rendir al máximo.',
            img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=300',
            items: ['Banana (varios kg)', 'Frutos Secos', 'Miel Pura', 'Acelga']
        },
        {
            id: 'c6', name: 'Combo semanal', price: 32000,
            desc: 'Mezcla pensada para una familia durante toda la semana, con frutas y verduras frescas de lunes a domingo.',
            img: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300',
            items: ['2kg Papa blanca', '1kg Cebolla blanca', '1kg Tomate', '1kg Fruta Mezclada']
        },
        {
            id: 'c7', name: 'Combo mensual', price: 120000,
            desc: 'Variedad completa de frutas y verduras para cubrir todo un mes, fresco y equilibrado para tu familia.',
            img: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=300',
            items: ['Canasta Mensual de Verduras', 'Canasta Mensual de Frutas', 'Miel Pura 2kg']
        },
        {
            id: 'c8', name: 'Combo llena la heladera', price: 85000,
            desc: 'Selección abundante de todas las frutas y verduras disponibles, para tener la heladera siempre lista y llena de frescura.',
            img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300',
            items: ['Mix Abundante de Verduras', 'Mix Abundante de Frutas']
        }
    ],
    individual: {
        'verduras': [
            { id: 'v1', name: 'tomate', price: 3500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v2', name: 'lechuga mantecosa', price: 2800, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v3', name: 'papa blanca', price: 1500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v4', name: 'cebolla blanca', price: 1800, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v5', name: 'cebolla morada', price: 2100, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v6', name: 'zanahoria', price: 1600, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v7', name: 'morrón', price: 4500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v8', name: 'pepino', price: 2200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v9', name: 'calabaza cabutia', price: 1900, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v10', name: 'calabaza anco', price: 1700, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v11', name: 'acelga', price: 2400, unit: 'kg', step: 0.5, min: 1 },
            { id: 'v13', name: 'cabeza de remolacha', price: 2600, unit: 'kg', step: 0.5, min: 1 }
        ],
        'frutas': [
            { id: 'f1', name: 'manzana roja', price: 4200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f2', name: 'manzana verde', price: 4600, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f3', name: 'banana', price: 3800, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f4', name: 'naranja', price: 3200, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f5', name: 'limón', price: 2500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f6', name: 'mandarina', price: 3000, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f8', name: 'durazno', price: 5500, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f9', name: 'pomelo', price: 3400, unit: 'kg', step: 0.5, min: 1 },
            { id: 'f7', name: 'bandeja de arándanos', price: 3500, unit: 'un', step: 1, min: 1 }
        ],
        'frutos-secos-extras': [
            { id: 's1', name: 'frutos secos', price: 18000, unit: 'g', step: 100, min: 100, max: 1000 },
            { id: 'ex1', name: 'miel pura', price: 7500, unit: 'kg', step: 0.5, min: 1 }
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
    // loadCustomerData(); // Eliminado para que el formulario inicie vacío
});

function loadCustomerData() {
    const savedData = localStorage.getItem('customer_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.fullname) document.getElementById('fullname').value = data.fullname;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.address) document.getElementById('address').value = data.address;
        if (data.phone) document.getElementById('phone').value = data.phone;
        if (data.deliveryDay) document.getElementById('delivery-day').value = data.deliveryDay;
        if (data.deliveryTime) document.getElementById('delivery-time').value = data.deliveryTime;

        // Validar si el botón debe habilitarse si ya hay datos y carrito
        updateSummary();
    }
}

function saveCustomerData() {
    const data = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        deliveryDay: document.getElementById('delivery-day').value,
        deliveryTime: document.getElementById('delivery-time').value
    };
    localStorage.setItem('customer_data', JSON.stringify(data));
}

function initUI() {
    const orderForm = document.getElementById('order-form');
    // Se elimina el listener de submit para que el navegador maneje el POST estándar

    // Cart Modal Events
    const cartBtn = document.getElementById('open-cart-btn');
    cartBtn.addEventListener('click', showCartModal);

    // Close modal when clicking background
    window.addEventListener('click', (e) => {
        const cartModal = document.getElementById('cart-modal');
        const comboModal = document.getElementById('combo-modal');
        const successModal = document.getElementById('success-modal');

        if (e.target === cartModal) closeCartModal();
        if (e.target === comboModal) closeComboModal();
        if (e.target === successModal) closeModal();
    });
}

function showCartModal() {
    const modal = document.getElementById('cart-modal');
    updateCartModalContent();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateCartModalContent() {
    const modalItems = document.getElementById('cart-modal-items');
    const modalTotal = document.getElementById('cart-modal-total-val');

    let total = 0;
    let html = '';

    const cartEntries = Object.values(cart);

    if (cartEntries.length === 0) {
        html = '<p style="text-align:center; padding: 20px; color: #888;">Tu carrito todavía está vacío.</p>';
    } else {
        cartEntries.forEach(item => {
            let itemPrice = item.price;
            let subtotal = 0;
            if (item.unit === 'g') {
                subtotal = (itemPrice / 1000) * item.qty;
            } else {
                subtotal = itemPrice * item.qty;
            }
            total += subtotal;

            html += `
                <div class="cart-modal-item">
                    <div class="cart-modal-item-info">
                        <span class="cart-modal-item-name">${item.name}</span>
                        <span class="cart-modal-item-qty">${item.qty}${item.unit}</span>
                    </div>
                    <span class="cart-modal-item-price">$${Math.round(subtotal).toLocaleString('es-AR')}</span>
                </div>
            `;
        });
    }

    modalItems.innerHTML = html;
    modalTotal.innerText = `$${Math.round(total).toLocaleString('es-AR')}`;
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
        <div class="combo-card" onclick="showComboDetails('${combo.id}')" style="cursor: pointer;">
            <img src="${combo.img}" alt="${combo.name}" class="combo-img">
            <div class="combo-info">
                <h3>${combo.name}</h3>
                <p>${combo.desc}</p>
                <div class="combo-price-row">
                    <span class="price">$${combo.price.toLocaleString('es-AR')}</span>
                    <div class="qty-control" onclick="event.stopPropagation()">
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
    const headerTotal = document.getElementById('cart-total-header');
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
            const itemText = `${item.name} (${item.qty}${item.unit})`;
            const subtotalText = `$${Math.round(subtotal).toLocaleString('es-AR')}`;

            itemsHtml += `
                <div class="summary-item">
                    <span>${itemText}</span>
                    <span>${subtotalText}</span>
                </div>
            `;
        });
    }

    summaryItems.innerHTML = itemsHtml;
    summaryTotal.innerText = `$${Math.round(total).toLocaleString('es-AR')}`;
    headerTotal.innerText = `$${Math.round(total).toLocaleString('es-AR')}`;

    // Sincronizar con campos ocultos para el envío estándar (Formspree)
    const hiddenDetails = document.getElementById('hidden-details');
    const hiddenTotal = document.getElementById('hidden-total');
    const hiddenSubject = document.getElementById('hidden-subject');
    const fullname = document.getElementById('fullname').value;

    if (hiddenDetails && hiddenTotal) {
        // Generar resumen de texto para el campo oculto
        const textSummary = Object.values(cart).map(item => {
            const sub = Math.round(item.unit === 'g' ? (item.price / 1000) * item.qty : item.price * item.qty);
            const unitLabel = item.unit === 'g' ? 'g' : (item.unit === 'un' ? ' un.' : 'kg');
            return `• ${item.name.toUpperCase()}: ${item.qty}${unitLabel} — $${sub.toLocaleString('es-AR')}`;
        }).join('\n');

        hiddenDetails.value = '\n' + textSummary;
        hiddenTotal.value = summaryTotal.innerText;

        // Actualizar asunto con hora para evitar hilos en Gmail
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0') + ':' +
            now.getSeconds().toString().padStart(2, '0');
        hiddenSubject.value = `🛒 Pedido [${timeStr}]: ${fullname || 'Cliente'}`;
    }

    // Also update modal if visible
    if (document.getElementById('cart-modal').style.display === 'flex') {
        updateCartModalContent();
    }

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

// Se eliminó handleOrderSubmit para utilizar el envío estándar de HTML POST dirigido a Formspree


function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
    cart = {};
    document.getElementById('order-form').reset();
    renderCombos();
    renderCustomProducts();
    updateSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showComboDetails(id) {
    const combo = PRODUCTS.combos.find(c => c.id === id);
    if (!combo) return;

    document.getElementById('modal-combo-img').src = combo.img;
    document.getElementById('modal-combo-img').alt = combo.name;
    document.getElementById('modal-combo-name').innerText = combo.name;
    document.getElementById('modal-combo-price').innerText = `$${combo.price.toLocaleString('es-AR')}`;

    const itemsList = document.getElementById('modal-combo-items');
    itemsList.innerHTML = combo.items.map(item => `<li><ion-icon name="checkmark-outline"></ion-icon> ${item}</li>`).join('');

    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = () => {
        updateComboQty(id, 1);
        closeComboModal();
    };

    document.getElementById('combo-modal').style.display = 'flex';
}

function closeComboModal() {
    document.getElementById('combo-modal').style.display = 'none';
}
