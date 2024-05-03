# Desafío clase 44

## Instalación y configuración

### Instalación de dependencias

---

- Para instalar las dependencias: `npm i`
- Para iniciar: `nodemon main`

### Configuración de entorno

---

- Agregar archivo .env en el directorio raíz con los siguientes parámetros:

```env
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

- Nuevas propiedades al modelo Users:
  - **_documents_**: arreglo para almacenar archivos
  - **_last_connection_**: última fecha de login/logout
- Nueva ruta y vista para cargar documentos al usuario:
  - Vista: **_/user-profile/:uid_**
  - Ruta: **_/api/users/:uid/documents_**
