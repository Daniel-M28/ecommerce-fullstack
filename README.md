# E-Commerce Full Stack

<img width="1337" height="592" alt="image" src="https://github.com/user-attachments/assets/b0c84a99-c1c2-4441-8398-879c0963c0f1" />



Aplicación web de comercio electrónico desarrollada como proyecto full-stack, con una arquitectura separada entre frontend y backend. El sistema permite gestionar productos, categorías, imágenes, usuarios, carritos y pedidos mediante una API REST.

El proyecto está orientado a la implementación de buenas prácticas de desarrollo, separación de responsabilidades, validación de datos, autenticación y gestión de roles.

## Tecnologías

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* Zod
* JWT

### Base de datos

* PostgreSQL

### Herramientas

* pnpm
* Git
* GitHub

---

##  Características

* Registro y autenticación de usuarios
* Autorización basada en roles
* Gestión de productos
* Gestión de categorías
* Gestión de imágenes de productos
* Control de stock
* Carrito de compras
* Gestión de pedidos
* Estados de pedidos
* Validación de datos con Zod
* API REST
* Manejo centralizado de errores
* Persistencia de datos con PostgreSQL
* ORM mediante Prisma

---

## Arquitectura

El proyecto utiliza una arquitectura separada entre frontend y backend, permitiendo mantener una clara separación de responsabilidades.

### Frontend

Desarrollado con **React + TypeScript**, utilizando una arquitectura orientada a componentes para construir una interfaz modular y reutilizable.

### Backend

Desarrollado con **Node.js + Express + TypeScript**, siguiendo una estructura modular para separar rutas, controladores, validaciones, configuración y lógica de negocio.

### Base de datos

**PostgreSQL** es utilizada como base de datos relacional y **Prisma ORM** como capa de acceso a datos.

La aplicación utiliza relaciones entre entidades como:

* Users
* Categories
* Products
* Product Images
* Carts
* Cart Items
* Orders
* Order Items

---

## API

El backend expone una API REST para gestionar los principales recursos de la aplicación.

### Health Check

```http
GET /api/health
```

### Autenticación

```http
POST /api/auth/register
POST /api/auth/login
```

### Categorías

```http
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Productos

```http
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

### Imágenes de productos

```http
GET    /api/products/:id/images
POST   /api/products/:id/images
DELETE /api/products/:id/images/:imageId
```

Los endpoints de carrito, usuarios y pedidos siguen la misma arquitectura REST del proyecto.

---

##  Autenticación y autorización

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación de usuarios.

La autorización se basa en roles, permitiendo diferenciar las operaciones disponibles para usuarios normales y administradores.

El acceso a determinadas operaciones administrativas está protegido mediante middleware de autorización.

---

## Modelo de datos

El sistema utiliza PostgreSQL y Prisma para gestionar las relaciones entre las principales entidades.

Los pedidos manejan diferentes estados dentro de su ciclo de procesamiento:

```text
PENDING
PAID
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

---

##  Validación y manejo de errores

Los datos recibidos por la API son validados mediante **Zod**, reduciendo la posibilidad de almacenar información inválida y proporcionando respuestas consistentes ante errores de validación.

El backend también cuenta con middleware centralizado para el manejo de errores HTTP.

---

## Scripts principales

Dependiendo del workspace, los principales comandos disponibles incluyen:

```bash
pnpm dev
pnpm build
pnpm start
```

Para trabajar con Prisma:

```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma migrate deploy
```

---

## Capturas de pantalla

### Página principal


<img width="623" height="586" alt="image" src="https://github.com/user-attachments/assets/9eb3763c-6cc0-4734-9d4b-5791241ae465" />




### Productos



<img width="622" height="578" alt="image" src="https://github.com/user-attachments/assets/8825afcc-c68e-4ddd-8af2-606887565b24" />





### Carrito



<img width="1307" height="589" alt="image" src="https://github.com/user-attachments/assets/aa489d55-e49a-4cab-ae50-47f70ee53124" />





### Administración



<img width="1335" height="591" alt="image" src="https://github.com/user-attachments/assets/203bc578-a698-49b9-9c8f-ab2d2cf214ce" />


---

## Estado del proyecto

Proyecto desarrollado como parte de mi portafolio profesional para demostrar experiencia práctica en desarrollo **Full Stack** utilizando tecnologías modernas del ecosistema JavaScript/TypeScript.

---

## Autor

**Daniel Murillo**

Desarrollador Full Stack

* React
* TypeScript
* Node.js
* Express
* PostgreSQL
* Prisma
* Laravel

---
