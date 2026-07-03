# Mini Tienda de Productos

Una aplicación de React Native creada con Expo, TypeScript y Bun, que cumple con los requisitos de la prueba técnica para una mini-tienda de productos.

## Requisitos previos
- **Node.js** (LTS) - Requerido por algunas herramientas de Expo y para la configuración inicial.
- **Bun** (>= 1.0) - Gestor de paquetes y ejecutor de scripts oficial del proyecto.
- **Expo CLI** - Para correr el proyecto de forma local.

## Tecnologías principales
- **Expo (Managed Workflow)**: Configuración rápida y acceso a APIs nativas.
- **TypeScript**: Tipado estricto en toda la aplicación (`strict: true`).
- **React Navigation**: Gestión de la navegación con Tabs y Stack.
- **Zustand + MMKV**: Estado global reactivo y persistencia ultra-rápida.
- **NativeWind (Tailwind)**: Estilos concisos y consistentes.
- **Axios**: Cliente HTTP con interceptores globales para centralizar el manejo de errores.
- **Reanimated**: Animaciones nativas de alto rendimiento (ej. botón de favoritos).
- **Jest + Testing Library**: Entorno de pruebas configurado.

## Instalación
Instala todas las dependencias usando Bun:
```bash
bun install
```

## Ejecución del proyecto
Para iniciar el entorno de desarrollo:
```bash
bun start
```
- Presiona `a` para abrir en un emulador de Android.
- Presiona `i` para abrir en el simulador de iOS (requiere macOS y Xcode).
- Escanea el código QR con la app **Expo Go** en tu dispositivo físico.

## Scripts de prueba
Para ejecutar la suite de pruebas unitarias y de componentes:
```bash
bun test
# o alternativamente:
bunx jest
```

## Estructura del proyecto
- `src/api/` - Configuración de Axios con interceptores globales.
- `src/components/` - Componentes de la interfaz de usuario (Listas, Skeletons, Botones animados).
- `src/hooks/` - Custom hooks para separar la lógica de peticiones a la API.
- `src/navigation/` - Definición y tipado de la navegación (RootNavigator).
- `src/screens/` - Pantallas principales de la aplicación (Productos, Detalle, Favoritos).
- `src/store/` - Estado global (Zustand) configurado con el middleware persist sobre MMKV.
- `src/types/` - Interfaces de TypeScript compartidas.

## Decisiones Técnicas
- **Bun**: Se eligió como gestor de paquetes principal por su alta velocidad de resolución y ejecución, garantizando tiempos de instalación mínimos.
- **Zustand + MMKV**: Zustand ofrece una API limpia y sin boilerplate para el manejo de estados globales, mientras que MMKV proporciona persistencia síncrona en C++, siendo exponencialmente más rápido que AsyncStorage.
- **Axios Global**: Un único cliente Axios con un interceptor nos asegura que errores como "Network Error" se capturen de forma global, retornando siempre un objeto predecible a nuestros hooks.
- **NativeWind**: Utilizar las clases de utilidad de Tailwind mejora la legibilidad de la vista, manteniendo el estilo acoplado al JSX y evitando grandes archivos de StyleSheet (se reservó el uso de StyleSheet solo cuando es estrictamente necesario, como integraciones específicas de animación).
- **Optimización de renders**: Se implementó `React.memo` para los elementos de las listas (`ProductListItem`) y se evitó la instanciación innecesaria de funciones anónimas inline, mejorando el performance del `FlatList`. Se implementó también `getItemLayout` para que FlatList sepa la altura de los ítems de antemano.
