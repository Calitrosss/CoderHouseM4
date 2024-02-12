# Desafío clase 24

- Modelo User contará con los campos:
  - first_name:String,
  - last_name:String,
  - email:String (único)
  - age:Number,
  - password:String(Hash)
  - cart:Id con referencia a Carts
  - role:String(default:’user’)
- Estrategias de Passport para que funcionen con este modelo de usuarios.
- Agregar al router /api/sessions/ la ruta /current, la cual utilizará el modelo de sesión que estés utilizando, para poder devolver en una respuesta el usuario actual.
