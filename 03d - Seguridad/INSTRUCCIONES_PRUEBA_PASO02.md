# Instrucciones para Probar el Paso 02 - Base de la API

## 1. PREPARACIÓN

### 1.1 Instalar dependencias
```bash
npm install
```

### 1.2 Iniciar el servidor
```bash
npm start
```

El servidor debe iniciar en puerto 5010 y mostrar estos mensajes:
```
Successfully connect to MongoDB.
Initial roles created
Roles creados: root, admin, user, guest
Usuario ROOT creado exitosamente
Server is running on port 5010.
```

---

## 2. PRUEBAS DE ENDPOINTS

### 2.1 GET / - Verificar que el servidor está activo
```
GET http://localhost:5010/
```
Respuesta esperada:
```json
{
  "status_code": 200,
  "status_message": "OK",
  "body_message": "Welcome to DemoYork application."
}
```

---

### 2.2 POST /users/signin - Iniciar sesión con usuario ROOT
```
POST http://localhost:5010/users/signin
Body JSON:
{
  "username": "root",
  "password": "root123456"
}
```
Respuesta esperada:
```json
{
  "status_code": 200,
  "status_message": "Ok",
  "body_message": {
    "id": "...",
    "username": "root",
    "email": "root@demoyork.com",
    "rol": "root"
  }
}
```

Nota: El servidor genera un token en la sesión automáticamente.

---

### 2.3 POST /users/signup - Crear nuevo usuario
```
POST http://localhost:5010/users/signup
Body JSON:
{
  "fullname": "Juan Pérez",
  "email": "juan@example.com",
  "username": "juan_user",
  "password": "password123",
  "rol": "user"
}
```
Respuesta esperada:
```json
{
  "status_code": 200,
  "status_message": "OK",
  "body_message": "Usuario registrado exitosamente"
}
```

---

### 2.4 GET /users - Obtener todos los usuarios (Requiere autenticación + ROL ADMIN/ROOT)

Primero, inicia sesión como ROOT para obtener el token.
Luego:
```
GET http://localhost:5010/users
Headers:
- Cookie: demoyork-session=...
```
Respuesta esperada:
```json
{
  "status_code": 200,
  "status_message": "OK",
  "body_message": [
    {
      "_id": "...",
      "fullname": "Administrator Root",
      "email": "root@demoyork.com",
      "username": "root",
      "password": "...",
      "rol": "root",
      "isProtected": true,
      "createdAt": "..."
    },
    ...
  ]
}
```

---

### 2.5 GET /users/{id} - Obtener usuario por ID (Requiere autenticación)
```
GET http://localhost:5010/users/{id}
Headers:
- Cookie: demoyork-session=...
```

---

### 2.6 PUT /users/{id} - Actualizar usuario (Requiere ROL ROOT)
```
PUT http://localhost:5010/users/{id}
Headers:
- Cookie: demoyork-session=...
Body JSON:
{
  "fullname": "Nuevo Nombre",
  "email": "nuevo@example.com",
  "password": "nuevapass123",
  "rol": "admin"
}
```

Nota: NO puedes actualizar el usuario ROOT (recibirás error 403).

---

### 2.7 DELETE /users/{id} - Eliminar usuario (Requiere ROL ROOT)
```
DELETE http://localhost:5010/users/{id}
Headers:
- Cookie: demoyork-session=...
```

Nota: NO puedes eliminar el usuario ROOT (recibirás error 403).

---

### 2.8 POST /users/signout - Cerrar sesión
```
POST http://localhost:5010/users/signout
```
Respuesta esperada:
```json
{
  "status_code": 200,
  "status_message": "OK",
  "body_message": "Sesión cerrada exitosamente"
}
```

---

## 3. VALIDACIONES DE SEGURIDAD

✅ Usuario ROOT:
- No se puede eliminar
- No se puede modificar (excepto contraseña)
- Es el único que puede crear/modificar/eliminar usuarios

✅ Roles:
- root (nivel 4)
- admin (nivel 3)
- user (nivel 2)
- guest (nivel 1)

✅ Middleware:
- verifyToken: Valida autenticación
- isRoot: Solo ROOT
- isAdmin: ROOT o ADMIN
- isUser: USER, ADMIN o ROOT

---

## 4. ESTRUCTURA COMPLETADA

```
03d - Seguridad/
├── server.js (✅ Configuración completa)
├── package.json (✅ Dependencias correctas)
├── config/
│   ├── configDB.js (✅ Conexión MongoDB)
│   └── configSecret.js (✅ JWT Secret)
├── models/
│   ├── mdl_Users.js (✅ Modelo con isProtected)
│   └── mdl_Roles.js (✅ 4 roles: root, admin, user, guest)
├── middleware/
│   └── func_Users.js (✅ Validaciones completas)
├── controllers/
│   ├── ctrl_Users.js (✅ CRUD completo)
│   └── ctrl_Categories.js (placeholders)
├── routes/
│   ├── rout_Users.js (✅ Rutas CRUD + middleware)
│   └── rout_Categories.js (placeholders)
└── INSTRUCCIONES_PRUEBA_PASO02.md (este archivo)
```

---

## 5. PRÓXIMOS PASOS (PASO 03)

El Paso 03 agregará:
- Rate Limit
- Validación de Payload
- Validación de entrada (formato, longitud)
- Content Security Policy
- Keep-Alive y Timeouts (ya configurados)
