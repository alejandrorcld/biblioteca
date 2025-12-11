# Biblioteca Personal

Una aplicación JavaScript full stack para gestionar tu colección personal de libros.

## Características

- ✅ Crear, leer, actualizar y eliminar libros
- ✅ Buscar libros por título o autor
- ✅ Ver detalles completos de cada libro
- ✅ Interfaz responsive y moderna
- ✅ Tests funcionales completos
- ✅ Base de datos MongoDB

## Requisitos Previos

- Node.js v14 o superior
- MongoDB corriendo en tu máquina (o en la nube)
- npm o yarn

## Instalación

1. **Clonar el repositorio**

```bash
git clone <tu-repositorio>
cd biblioteca
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con:

```
DB=mongodb://localhost:27017/biblioteca
NODE_ENV=test
```

**Nota:** Si usas MongoDB Atlas en la nube, reemplaza la URL:

```
DB=mongodb+srv://usuario:contraseña@cluster.mongodb.net/biblioteca
NODE_ENV=test
```

## Uso

### Ejecutar la aplicación en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Ejecutar la aplicación en producción

```bash
npm start
```

### Ejecutar tests

```bash
npm test
```

## Estructura del Proyecto

```
biblioteca/
├── models/              # Esquemas de MongoDB
│   └── Book.js
├── routes/              # Rutas de la API
│   └── api.js
├── public/              # Archivos estáticos (CSS, JS)
│   ├── styles.css
│   └── script.js
├── views/               # Plantillas EJS
│   └── index.ejs
├── tests/               # Tests funcionales
│   └── 2_functional-tests.js
├── server.js            # Punto de entrada
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Books

- `GET /api/books` - Obtener todos los libros
- `GET /api/books/:id` - Obtener un libro específico
- `POST /api/books` - Crear un nuevo libro
- `PUT /api/books/:id` - Actualizar un libro
- `DELETE /api/books/:id` - Eliminar un libro
- `DELETE /api/books` - Eliminar todos los libros

### Request/Response

**POST /api/books** - Crear libro

```json
{
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "isbn": "978-0-123456-78-9",
  "description": "Una novela clásica de la literatura española",
  "pages": 863,
  "publishedDate": "1605-01-16"
}
```

## Tests

La aplicación incluye 12 tests funcionales que cubren:

- ✅ GET todos los libros (vacío y con datos)
- ✅ POST nuevo libro
- ✅ GET libro específico
- ✅ PUT actualizar libro
- ✅ DELETE libro individual
- ✅ DELETE todos los libros
- ✅ Validación de errores

Ejecuta los tests con:

```bash
npm test
```

## Requisitos del Proyecto

- ✅ Full Stack JavaScript
- ✅ Express.js para el backend
- ✅ MongoDB para la base de datos
- ✅ HTML/CSS/JavaScript para el frontend
- ✅ .env configurado con DB y NODE_ENV
- ✅ Todas las rutas en `routes/api.js`
- ✅ Tests en `tests/2_functional-tests.js`
- ✅ Interfaz completa y funcional

## Licencia

MIT

## Autor

[Tu nombre]
