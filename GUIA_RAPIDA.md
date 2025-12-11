# 📚 BIBLIOTECA PERSONAL - GUÍA RÁPIDA

## ✅ Aplicación Completada

Se ha construido exitosamente una aplicación JavaScript full stack para una biblioteca personal.

---

## 📋 Características Implementadas

### Backend (Express.js + MongoDB)
- ✅ **API RESTful completa** con todos los endpoints CRUD
- ✅ **Modelo de datos** para libros con campos: título, autor, ISBN, descripción, páginas, fecha de publicación
- ✅ **Rutas API** en `routes/api.js` con:
  - GET /api/books - Obtener todos
  - GET /api/books/:id - Obtener uno
  - POST /api/books - Crear
  - PUT /api/books/:id - Actualizar
  - DELETE /api/books/:id - Eliminar uno
  - DELETE /api/books - Eliminar todos

### Frontend (HTML/CSS/JavaScript)
- ✅ **Interfaz moderna y responsive** con gradientes y animaciones
- ✅ **Funcionalidades**:
  - Agregar nuevos libros
  - Ver lista de libros con detalles
  - Buscar por título o autor
  - Editar libros
  - Eliminar libros individuales o todos
  - Modal para edición
  - Validación de formularios
  - Mensajes de éxito/error

### Testing
- ✅ **12 tests funcionales** en `tests/2_functional-tests.js` con Mocha + Chai
- ✅ Cobertura completa: CRUD, validación de errores, casos edge

### Configuración
- ✅ **`.env`** configurado con:
  - DB=mongodb://localhost:27017/biblioteca
  - NODE_ENV=test
- ✅ **`package.json`** con scripts: start, test, dev

---

## 🚀 CÓMO USAR

### 1. Instalar Dependencias
```bash
cd /home/zero/Documentos/proyectos/biblioteca
npm install
```
(Ya completado)

### 2. Iniciar MongoDB
```bash
# Si tienes MongoDB instalado localmente:
mongod

# O si usas Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Ejecutar la Aplicación

**Modo desarrollo** (con auto-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

**Acceso en el navegador**:
```
http://localhost:3000
```

### 4. Ejecutar Tests
```bash
npm test
```

Deberías ver los 12 tests pasando:
- GET /api/books - Get all books (empty)
- POST /api/books - Add a new book
- POST /api/books - Reject book without title or author
- GET /api/books - Get all books (with data)
- GET /api/books/:id - Get a specific book
- GET /api/books/:id - Get non-existent book
- PUT /api/books/:id - Update a book
- PUT /api/books/:id - Update non-existent book
- DELETE /api/books/:id - Delete a book
- DELETE /api/books/:id - Delete non-existent book
- DELETE /api/books - Delete all books

---

## 📁 Estructura del Proyecto

```
/home/zero/Documentos/proyectos/biblioteca/
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos ignorados por git
├── README.md                     # Documentación
├── server.js                     # Servidor principal
├── package.json                  # Dependencias y scripts
├── package-lock.json
│
├── models/
│   └── Book.js                   # Esquema MongoDB de libros
│
├── routes/
│   └── api.js                    # Todas las rutas API
│
├── public/
│   ├── styles.css                # Estilos CSS
│   └── script.js                 # JavaScript del frontend
│
├── views/
│   └── index.ejs                 # Plantilla HTML principal
│
├── tests/
│   └── 2_functional-tests.js     # Tests funcionales Mocha/Chai
│
├── node_modules/                 # Dependencias instaladas
└── .git/                         # Repositorio git
```

---

## 🔧 Variables de Entorno (.env)

```
DB=mongodb://localhost:27017/biblioteca
NODE_ENV=test
```

**Si usas MongoDB Atlas** (nube):
```
DB=mongodb+srv://usuario:contraseña@cluster.mongodb.net/biblioteca
NODE_ENV=test
```

---

## 🧪 Tests Funcionales

Los tests están ubicados en `tests/2_functional-tests.js` y cubren:

1. ✅ **GET todos los libros** (vacío y con datos)
2. ✅ **POST crear libro** (válido e inválido)
3. ✅ **GET libro específico** (existente y no existente)
4. ✅ **PUT actualizar libro** (existente y no existente)
5. ✅ **DELETE libro individual** (existente y no existente)
6. ✅ **DELETE todos los libros**

---

## 📡 API Reference

### GET /api/books
Obtener todos los libros

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "isbn": "978-0-123456-78-9",
    "description": "Una novela clásica",
    "pages": 863,
    "publishedDate": "1605-01-16T00:00:00.000Z",
    "createdAt": "2024-12-11T10:30:00.000Z",
    "updatedAt": "2024-12-11T10:30:00.000Z"
  }
]
```

### POST /api/books
Crear un nuevo libro

**Request:**
```json
{
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "isbn": "978-0-123456-78-9",
  "description": "Una novela clásica",
  "pages": 863,
  "publishedDate": "1605-01-16"
}
```

**Response:** (Código 201)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  ...
}
```

### PUT /api/books/:id
Actualizar un libro

**Request:**
```json
{
  "title": "El Quijote (Nueva Edición)",
  "pages": 900
}
```

### DELETE /api/books/:id
Eliminar un libro individual

### DELETE /api/books
Eliminar todos los libros

---

## 🔍 Solución de Problemas

### Error: "Cannot connect to MongoDB"
1. Verifica que MongoDB está corriendo:
   ```bash
   mongosh  # o mongo
   ```
2. Comprueba la URI en `.env`
3. Si usas MongoDB Atlas, asegúrate de que la IP está en whitelist

### Error: "Port 3000 is already in use"
```bash
# Cambia el puerto en server.js o usa:
PORT=3001 npm start
```

### Tests fallan
1. Asegúrate de que MongoDB está corriendo
2. Ejecuta los tests nuevamente:
   ```bash
   npm test
   ```
3. Revisa los logs de salida

---

## 💾 Repositorio Git

El proyecto está inicializado como un repositorio git local:

```bash
cd /home/zero/Documentos/proyectos/biblioteca
git status  # Ver cambios
git log     # Ver historial
```

Para agregar a un repositorio remoto (GitHub, GitLab, etc.):
```bash
git remote add origin <tu-url-del-repositorio>
git push -u origin master
```

---

## 📦 Dependencias Instaladas

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **dotenv** - Variables de entorno
- **cors** - Manejo de CORS
- **body-parser** - Parsing de JSON
- **mocha** - Framework de testing
- **chai** - Librería de assertions
- **chai-http** - HTTP testing para Chai
- **nodemon** - Auto-reload en desarrollo

---

## ✨ Características Adicionales

1. **Validación de datos** - Campos requeridos y formato
2. **Búsqueda en tiempo real** - Filtro por título o autor
3. **Interfaz responsive** - Funciona en móvil y desktop
4. **Mensajes de estado** - Feedback visual de acciones
5. **Timestamps** - createdAt y updatedAt automáticos
6. **Ordenamiento** - Libros más recientes primero
7. **Prevención XSS** - Escapado de HTML en el frontend

---

## 🎯 Próximos Pasos (Opcional)

1. Agregar autenticación de usuarios
2. Implementar paginación
3. Agregar filtros avanzados
4. Exportar/Importar libros
5. Hacer deploy en Heroku o Vercel
6. Agregar base de datos de terceros (API de libros)

---

## 📧 Contacto

Para más información, revisa el README.md completo en la carpeta del proyecto.

**¡Tu aplicación de biblioteca personal está lista para usar! 📚✨**
