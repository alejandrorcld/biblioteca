# INSTRUCCIONES PARA REPLIT Y FCC

## Pasos para subir a Replit:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/alejandrorcld/biblioteca.git
   cd biblioteca
   ```

2. **En Replit, abre la terminal e instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura MongoDB:**
   - Opción A: Usa MongoDB local (si Replit lo proporciona)
   - Opción B: Usa MongoDB Atlas (nube)
     - Crea cuenta en https://www.mongodb.com/cloud/atlas
     - Obtén la URI de conexión
     - En Replit, edita `.env` y cambia `DB` a tu URI de MongoDB Atlas

4. **Para ejecutar la aplicación:**
   ```bash
   npm start
   ```
   La app estará en `http://localhost:3000`

5. **Para ejecutar los tests:**
   ```bash
   npm test
   ```

## Para FCC:

Proporciona estos datos en FCC:

- **Enlace a la solución (URL pública):** 
  - Tu URL de Replit (Replit genera automáticamente una URL pública)
  - Formato: `https://tu-nombre-replit.replit.dev`

- **Enlace al código fuente:** 
  - https://github.com/alejandrorcld/biblioteca

## Estructura del proyecto:

```
biblioteca/
├── .env                    # Variables: DB y NODE_ENV
├── server.js              # Servidor Express
├── routes/api.js          # Todas las rutas CRUD
├── models/Book.js         # Modelo MongoDB
├── tests/2_functional-tests.js  # Tests Mocha/Chai
├── views/index.ejs        # Interfaz HTML
├── public/
│   ├── styles.css
│   └── script.js
└── package.json
```

## Scripts disponibles:

- `npm start` - Inicia el servidor en puerto 3000
- `npm test` - Ejecuta los tests funcionales
- `npm run dev` - Desarrollo con nodemon (auto-reload)

## Requisitos cumplidos:

✅ Full Stack JavaScript (Node.js + Express + MongoDB)
✅ `.env` configurado con DB y NODE_ENV
✅ Todas las rutas en `routes/api.js`
✅ Tests en `tests/2_functional-tests.js`
✅ Interfaz de usuario funcional
✅ CRUD completo para libros
