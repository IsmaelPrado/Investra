# Investra

Investra es una plataforma de simulación de inversiones que permite a los usuarios analizar y gestionar portafolios de activos. Combina un backend robusto y un frontend interactivo para ofrecer una experiencia integral.

## 📖 Descripción

El proyecto está diseñado para simular la dinámica de mercados financieros, permitiendo:
- Actualización de precios y estrategias de inversión.
- Gestión de activos como acciones y bonos.
- Conexión en tiempo real con WebSocket para notificaciones instantáneas.

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Framework**: React
- **Librerías**: 
  - Axios (para llamadas a la API)
  - Socket.IO Client (para WebSocket)

### **Backend**
- **Lenguaje**: TypeScript (Node.js)
- **Framework**: Express.js
- **Base de datos**: PsotgreSQL
- **WebSocket**: Socket.IO (para comunicación en tiempo real)
- **Patrón de diseño**: Strategy para actualización de precios e inversiones

---

## 📂 Estructura del Proyecto

```plaintext
investra/
├── backend/
│   ├── models/                # Modelos de datos (Activos, Inversiones)
│   ├── controllers/           # Lógica del negocio
│   ├── routes/                # Rutas de la API REST
│   ├── strategies/            # Implementación del patrón Strategy
│   ├── index.ts              # Punto de entrada del servidor
│   └── package.json           # Dependencias del backend
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables de React
│   │   ├── pages/             # Vistas principales
│   │   ├── services/          # Llamadas a la API
│   │   └── App.tsx            # Punto de entrada del frontend
│   └── package.json           # Dependencias del frontend
│
├── README.md                  # Archivo de documentación
└── .gitignore                 # Archivos y carpetas ignorados por Git
