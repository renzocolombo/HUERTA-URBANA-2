const fs = require('fs')

const precios = JSON.parse(fs.readFileSync('precios.json', 'utf8'))
let html = fs.readFileSync('index.html', 'utf8')

const VERDURAS = ['Papa', 'Cebolla común', 'Cebolla morada', 'Tomate', 'Tomate cherry', 
  'Zanahoria', 'Lechuga', 'Zapallito', 'Zapallo blanco', 'Morrón rojo', 'Rúcula', 
  'Espinaca', 'Remolacha', 'Pepino', 'Brócoli', 'Cabutia', 'Ajo', 'Berenjena']

const FRUTAS = ['Palta', 'Manzana roja', 'Manzana verde', 'Banana', 'Naranja', 
  'Limón', 'Durazno', 'Pomelo', 'Uva', 'Arándano', 'Choclo']

const productosActivos = precios.productos.filter(p => p.activo)

const verduras = productosActivos
  .filter(p => VERDURAS.some(v => v.toLowerCase() === p.nombre.toLowerCase().trim()))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

const frutas = productosActivos
  .filter(p => FRUTAS.some(f => f.toLowerCase() === p.nombre.toLowerCase().trim()))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

const extras = productosActivos
  .filter(p => !VERDURAS.some(v => v.toLowerCase() === p.nombre.toLowerCase().trim()) 
            && !FRUTAS.some(f => f.toLowerCase() === p.nombre.toLowerCase().trim()))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

const capitalizar = str => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const generarProductos = (productos) => productos.map(p => ({
  id: p.nombre.toLowerCase().replace(/ /g, '-'),
  name: capitalizar(p.nombre),
  price: Math.floor(p.precio),
  unit: p.unidad,
  step: 0.5,
  min: 0.5
}))

const todosProductos = {
  verduras: generarProductos(verduras),
  frutas: generarProductos(frutas),
  extras: generarProductos(extras)
}

// Reemplazar el objeto PRODUCTS.individual en el HTML
const productsRegex = /const PRODUCTS\s*=\s*\{[\s\S]*?individual:\s*\{[\s\S]*?\}\s*\}/
const nuevoProductos = `const PRODUCTS = {
  combos: PRODUCTS_COMBOS,
  individual: ${JSON.stringify(todosProductos, null, 2)}
}`

html = html.replace(productsRegex, nuevoProductos)

// Actualizar monto mínimo
const monto = Math.floor(precios.monto_minimo).toLocaleString('es-AR')

html = html.replace(
  /(<span id="envio-gratis-monto">)[^<]*/,
  (_, p1) => `${p1}$${monto}`
)
html = html.replace(
  /(<span id="compra-minima-monto">)[^<]*/,
  (_, p1) => `${p1}$${monto}`
)
html = html.replace(
  /(<span id="footer-minima-monto">)[^<]*/,
  (_, p1) => `${p1}$${monto}`
)

fs.writeFileSync('index.html', html)
console.log(`✅ Productos actualizados: ${verduras.length} verduras, ${frutas.length} frutas, ${extras.length} extras`)
