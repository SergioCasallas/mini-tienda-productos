# Mini Tienda de Productos

Una aplicación de React Native creada con Expo, TypeScript y Bun, que cumple con los requisitos de la prueba técnica para una mini-tienda de productos.

## Requisitos previos

Para poder instalar y compilar el proyecto sin inconvenientes, es sumamente importante contar con las siguientes versiones de software en tu entorno:

### 1. Entorno de Ejecución y Gestión de Paquetes
* **Bun** (`>= 1.1.0`): Gestor de paquetes principal del proyecto.
* **Node.js** (`>= 22.13.0` LTS o `v20.x` LTS): Requerido de forma obligatoria por herramientas internas de Expo CLI para el prebuild y dependencias nativas.

### 2. Para Compilación de Android (Windows, macOS, Linux)
* **JDK (Java Development Kit)**: **JDK 17**. React Native `0.86` y Expo SDK `57` están estandarizados bajo esta versión. *(Evita JDK 21 o superiores, ya que pueden causar incompatibilidad con Gradle).*
* **Android Studio & SDK**:
  * Android SDK Command-line Tools y SDK Platform 35 (o la correspondiente al target del proyecto).
  * Variables de entorno configuradas (`ANDROID_HOME` y rutas de `platform-tools` en el `PATH`).

### 3. Para Compilación de iOS (Solo macOS)
* **macOS** actualizado.
* **Xcode** (`>= 16.0`): Para soporte completo del SDK de iOS actual.
* **CocoaPods** (`>= 1.15.0`): Requerido para instalar los pods nativos del proyecto.

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

1. Clona el repositorio:
```bash
git clone https://github.com/SergioCasallas/mini-tienda-productos.git
cd mini-tienda-productos
```

2. Instala todas las dependencias usando Bun:
```bash
bun install
```

## Ejecución del proyecto

> [!IMPORTANT]
> Este proyecto utiliza librerías nativas como `react-native-mmkv`, por lo que **no se puede ejecutar en la aplicación estándar de Expo Go**. Es necesario generar y compilar un build de desarrollo nativo.

Sigue las instrucciones correspondientes según tu sistema operativo y plataforma:

### 1. Requisitos para Compilación Nativa
* **Android (Windows, macOS, Linux):**
  * Android Studio instalado.
  * SDK de Android y variables de entorno configuradas (`ANDROID_HOME`).
  * Un emulador de Android configurado o un dispositivo físico conectado con depuración USB habilitada.
* **iOS (Sólo en macOS):**
  * Xcode instalado.
  * Herramientas de línea de comandos de Xcode y CocoaPods instalados.

### 2. Comandos de Ejecución

#### Para Android (Windows, macOS, Linux)
Compila el código nativo, genera el build de desarrollo e instálalo en tu emulador o dispositivo físico:
```bash
bun expo run:android
# o alternativamente:
bun android
```

#### Para iOS (Sólo macOS)
Instala las dependencias de CocoaPods y compila en el simulador de iOS:
```bash
bun expo run:ios
# o alternativamente:
bun ios
```

Una vez que la aplicación nativa de desarrollo esté instalada en tu emulador o dispositivo, en las siguientes sesiones puedes iniciar únicamente el servidor de desarrollo de Metro usando:
```bash
bun start
```

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

## Funcionalidades Extra (Pluses)

Con el fin de elevar la experiencia de usuario (UX) y demostrar prácticas avanzadas en el desarrollo con React Native, se incorporaron las siguientes características adicionales al alcance básico de la prueba:

- **Autenticación Demo y Flujo Protegido**: Se creó un flujo condicional de navegación protegido ([RootNavigator.tsx](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/navigation/RootNavigator.tsx)) gestionado por un store de autenticación ([authStore.ts](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/store/authStore.ts)) persistido con MMKV. Permite iniciar sesión simulando latencia de red y cerrar sesión con confirmación visual.
- **Gesto de Deslizamiento Rápido (Swipe to Favorite)**: Permite deslizar los elementos de la lista hacia la derecha para marcarlos/desmarcarlos como favoritos instantáneamente. Creado a través de [SwipeableRow.tsx](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/components/SwipeableRow.tsx) utilizando las APIs nativas `PanResponder` y `Animated`.
- **Modo de Selección Múltiple y Borrado en Lote**: En la pantalla de favoritos, una pulsación larga sobre un ítem activa el modo de edición por lotes. La barra superior (Header) cambia para reflejar la cantidad seleccionada y permite borrarlos masivamente.
- **Lista de Recomendación de Productos (Rappi Style)**: En la parte inferior del detalle de producto, se añadió una sección horizontal ([SuggestedProducts.tsx](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/components/SuggestedProducts.tsx)) con sugerencias de otros productos de manera aleatoria. Permite agregar/quitar de favoritos de forma instantánea mediante un botón interactivo (con animación de rebote) y navegar fluidamente a otros productos utilizando `navigation.push`. Está altamente optimizada usando renderizado inteligente de `FlatList` y `React.memo`.
- **Skeletons de Carga Animados (Shimmer Effect)**: Se reemplazaron los cargadores predeterminados por marcadores de posición animados ([SkeletonLoader.tsx](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/components/SkeletonLoader.tsx)) usando `react-native-reanimated` para una carga visual agradable.
- **Notificaciones Toast Flotantes**: Mensajes dinámicos que entran y salen flotando en la pantalla ([Toast.tsx](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/components/Toast.tsx)) para notificar inmediatamente al usuario cada vez que agrega o quita favoritos.
- **Modales de Confirmación**: Se implementó un componente reutilizable [ConfirmationModal.tsx](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/components/ConfirmationModal.tsx) para asegurar acciones críticas como cerrar sesión o eliminar productos favoritos.
- **Interceptor Global de API**: Configuración de Axios en [client.ts](file:///home/sergiocasallas/Documents/mini-tienda-productos/src/api/client.ts) para centralizar la captura y el formateo estandarizado de los errores de red.

## Decisiones Técnicas
- **Bun**: Se eligió como gestor de paquetes principal por su alta velocidad de resolución y ejecución, garantizando tiempos de instalación mínimos.
- **Zustand + MMKV**: Zustand ofrece una API limpia y sin boilerplate para el manejo de estados globales, mientras que MMKV proporciona persistencia síncrona en C++, siendo exponencialmente más rápido que AsyncStorage.
- **Axios Global**: Un único cliente Axios con un interceptor nos asegura que errores como "Network Error" se capturen de forma global, retornando siempre un objeto predecible a nuestros hooks.
- **NativeWind**: Utilizar las clases de utilidad de Tailwind mejora la legibilidad de la vista, manteniendo el estilo acoplado al JSX y evitando grandes archivos de StyleSheet (se reservó el uso de StyleSheet solo cuando es estrictamente necesario, como integraciones específicas de animación).
- **Optimización de renders**: Se implementó `React.memo` para los elementos de las listas (`ProductListItem`) y se evitó la instanciación innecesaria de funciones anónimas inline, mejorando el performance del `FlatList`. Se implementó también `getItemLayout` para que FlatList sepa la altura de los ítems de antemano.

## Coverage

<img width="729" height="468" alt="annotate-2026-07-04_23-01-53" src="https://github.com/user-attachments/assets/6d731d61-6d1d-42b6-ab67-d1a5167a6e6b" />
