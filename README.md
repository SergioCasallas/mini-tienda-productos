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
Instala todas las dependencias usando Bun:
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

## Decisiones Técnicas
- **Bun**: Se eligió como gestor de paquetes principal por su alta velocidad de resolución y ejecución, garantizando tiempos de instalación mínimos.
- **Zustand + MMKV**: Zustand ofrece una API limpia y sin boilerplate para el manejo de estados globales, mientras que MMKV proporciona persistencia síncrona en C++, siendo exponencialmente más rápido que AsyncStorage.
- **Axios Global**: Un único cliente Axios con un interceptor nos asegura que errores como "Network Error" se capturen de forma global, retornando siempre un objeto predecible a nuestros hooks.
- **NativeWind**: Utilizar las clases de utilidad de Tailwind mejora la legibilidad de la vista, manteniendo el estilo acoplado al JSX y evitando grandes archivos de StyleSheet (se reservó el uso de StyleSheet solo cuando es estrictamente necesario, como integraciones específicas de animación).
- **Optimización de renders**: Se implementó `React.memo` para los elementos de las listas (`ProductListItem`) y se evitó la instanciación innecesaria de funciones anónimas inline, mejorando el performance del `FlatList`. Se implementó también `getItemLayout` para que FlatList sepa la altura de los ítems de antemano.
