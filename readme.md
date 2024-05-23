# Entrega Final

## Instalación y configuración

### Instalación de dependencias

- Para instalar las dependencias: `npm i`
- Para iniciar: `nodemon main`

---

### Configuración de carpetas

- Se deben crear las carpetas "profiles", "documents" y "products" dentro de "public" en caso de que no existan, deben quedar de la siguiente manera:
  - public/profiles
  - public/documents
  - public/products

---

### Configuración de entorno

- Agregar archivo .env en el directorio raíz con los siguientes parámetros (ejemplos entre paréntesis):

```env
ENVIRONMENT=(production ó development)
PORT=(8080)
DOMAIN=(http://localhost:8080)
MONGO_URL=
SECRET_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
GOOGLE_APP_EMAIL=
GOOGLE_APP_PASS=
```

## Aspectos incluídos

- Nuevas rutas para obtener listado de usuarios y limpiiar todos los usuarios que no hayan tenido conexión en los últimos 2 días, los usuario eliminados recibirán un email (**_solo accesibles por el administrador_**):

  - Ruta GET: **_/api/users_**
  - Ruta DELETE: **_/api/users_**

- Nueva ruta y vista para mostrar listado de usuarios y permite cambiar rol y eliminiar usuario, el usuario eliminados recibirán un email (**_solo accesible por el administrado_**):

  - Vista: **_/users-administrator_**
  - Ruta DELETE: **_/api/users/:uid_**

- Modificación de endpoint que elimina productos, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado.

  - Ruta DELETE: **_/api/products/:pid_**

- Se modifica vista de productos para agregar funcionalidad al botón de agregar al carrito, mostrar el botón de ir a listado de usuarios en caso de usuario administrador y el botón ir a perfil de usuario en caso de usuario no administrador:

  - Vista: **_/products_**

- Se agrega vista para mostrar carrito y terminar el flujo de compra mostrando el ticket geenerado
  - Vista: **_/carts/:cid_**
