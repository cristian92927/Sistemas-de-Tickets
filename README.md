# Sistema de Tickets

Sistema de gestión de tickets de soporte con Backend en Node.js, Frontend en Angular y Base de Datos SQL Server.

## Requisitos Previos

- Node.js (v18+)
- SQL Server
- Angular CLI (Recomendado)

## Estructura del Proyecto

- `/backend`: API REST en Node.js
- `/frontend`: Aplicación web en Angular
- `/db`: Scripts de base de datos

## Configuración

### 1. Base de Datos

1. Asegúrate de tener una instancia de SQL Server corriendo.
2. Ejecuta el script `db/schema.sql` para crear las tablas necesarias (`clients`, `agents`, `tickets`).
   - Puedes hacerlo desde SQL Server Management Studio (SSMS) o Azure Data Studio.

### 2. Backend

1. Navega a la carpeta backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Crea un archivo `.env` basado en `.env.example`.
   - Ajusta `DB_USER`, `DB_PASSWORD`, `DB_SERVER` y `DB_NAME` según tu configuración local.
4. Inicia el servidor:
   ```bash
   npm start
   ```
   El servidor correrá en `http://localhost:3000`.

### 3. Frontend

1. Navega a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200`.

## Uso y Verificación

### Flujo de Prueba

1. **Crear Datos Maestros:**
   - Ve a `/clients` y verifica la lista (estará vacía inicialmente).
   - Usa Postman o crea un formulario temporal (si implementado) para agregar clientes vía API `POST /clients`.
   - Idem para Agentes `POST /agents`.

2. **Crear Ticket:**
   - Ve a `/tickets/new`.
   - Selecciona un cliente, ingresa título y descripción.
   - El ticket se creará en estado `OPEN`.

3. **Asignar Agente:**
   - Ve al detalle del ticket (`/tickets/:id`).
   - Asigna un agente disponible.
   - El estado debería permitir pasar a `IN_PROGRESS`.

4. **Resolver Ticket:**
   - Cambia el estado a `RESOLVED`.
   - Debes ingresar un texto de resolución.

5. **Reglas de Negocio:**
   - Intenta asignar más de 5 tickets `IN_PROGRESS` a un mismo agente (debería fallar).
   - Intenta resolver un ticket sin resolución (debería fallar).
   - Intenta reabrir un ticket resuelto (debería fallar).
