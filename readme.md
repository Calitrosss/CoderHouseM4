# Desafío clase 37

## Instalación y configuración

### Instalación de dependencias

---

- Para instalar las dependencias: `npm i`
- Para iniciar: `nodemon main`

### Configuración de entorno

---

- Agregar archivo .env en el directorio raíz con los siguientes parámetros:

```
ENVIRONMENT=
PORT=
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

---

Se agrega un sistema de recuperación de contraseña, la cual envía por medio de un correo un link que redirecciona a una página para restablecer la contraseña (no recuperarla):

- Si se trata de restablecer la contraseña con la misma contraseña del usuario, no se permite y se indica que no se puede colocar la misma contraseña.

Se establece un nuevo rol para el schema del usuario llamado “premium” el cual está habilitado también para crear productos.

Se modificar el schema de producto para contar con un campo “owner”, el cual hace referencia a la persona que creó el producto:

- Si un producto se crea sin owner, se coloca por defecto “admin”.
- El campo owner deberá guarda \_id del usuario que lo haya creado (Sólo puede recibir usuarios premium).

Se modifican los permisos de actualización y eliminación de productos para que:

- Un usuario premium sólo pueda borrar los productos que le pertenecen.
- El admin pueda borrar cualquier producto, aún si es de un owner.

Se modifica la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece.

Se implementar una nueva ruta en el router de api/users, la cual es /api/users/premium/:uid y que permitire cambiar el rol de un usuario, de “user” a “premium” y viceversa.
