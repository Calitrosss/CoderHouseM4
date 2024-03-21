# Desafío clase 34

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
```

## Aspectos incluídos

### Winston Logger

---

- Se define un sistema de niveles que tenga la siguiente prioridad (de menor a mayor): debug, http, info, warning, error, fatal
- Se implemente un logger para ambientes de desarrollo y producción
- Logger de desarrollo sólo a consola y de nivel debug
- Logger de producción a consola de nivel info y a archivo de nivel error
- Se agrega ruta "/api/loggerTest" para pruebas de logger
- Variable de entorno "ENVIRONMENT" admite los siguientes valores:
  - development
  - production
- El logger predeterminado será el de desarrollo en caso de no existir la variable de entorno "ENVIRONMENT" o si no tiene valor correcto
- Se sustituyen los console.log() más críticos para usar el logger en su lugar
