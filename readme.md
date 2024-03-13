# Desafío clase 32

## Instalación y configuración

### Instalacón de dependencias

---

- Para instalar las dependencias: `npm i`
- Para iniciar: `nodemon main`

### Configuración de entorno

---

- Agregar archivo .env en el directorio raíz con los siguientes parámetros:

```
PORT=
MONGO_URL=
SECRET_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
```

## Aspectos incluídos

### Mocking y manejo de errores

---

- Se agrega ruta "/api/mocks/mockingproducts" para mocks de productos
- Se agrega generador de errores personalizados y se implemente en los controladores de products y carts
