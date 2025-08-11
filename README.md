Notas nuestras:
con: pnpm run dev:react se ejecuta todo con hot reload

# Electron POC

EL proyecto va a tratar sobre una app de notas cifradas, con el objetivo de comparar que tan bien cumplen ambos frameworks su objetivo.

## Impresiones

### 1- Comparativa Técnica

### 2- Experiencia de Desarrollo

### 3- Conclusiones y recomendaciones

## Datos técnicos descubiertos durante desarrollo

- El proceso principal de Electron corre en una instancia de **Node.js** y es el responsable del ciclo de vida de nuestra app, es el que muestra interfaces nativas, realiza operaciones privilegiadas y maneja los **Procesos de renderizado**

- Los **Procesos de renderizado** son los encargados de mostrar el contenido gráfico. Podemos cargar una página web en el renderer apuntandola a una web address o a un archivo html local. Los **Renderers** se comportan de manera muy similar a las páginas web y tienen acceso a las mismas web APIs.

- El término **'Polyfill'** se refiere a un pedazo de código que implementa funcionalidades que no estan disponibles de forma nativa en el runtime que se esta utilizando, lo que hace es **'Llenar'** las featuers que faltan. En nuestro caso se usa mucho para compensar
  A polyfill is code that implements functionality that isn't natively available in the current environment, essentially "filling in" missing features.

- Cada aplicación de Electron esta estructurada de manera muy similar. Como desarrollador controlamos dos tipos de procesos: el **main** y el **renderer**. Estos son análogos a los que usa Chrome

### El proceso principal o main

Cada app de Electron tiene un solo proceso **Main**, que actua como el entry point de la aplicación. Este proceso, como ya se dijo, corre en un entorno de Node.js, lo que significa que tiene la habilidad de importar modulos y usar toda la API de Node.js

#### Window Management

El objetivo principal del **main** es crear y manejar ventanas con el módulo **BrowserWindow**. Cada instancia del **BrowserWindow** crea una ventana de la aplicación que carga una página web en un proceso **renderer** aparte. Podemos interactuar con el contenido de esta página web desde el nmain usando el objeto del window llamado **webContents**.
Ejemplo:

```js
//main.js
const { BrowserWindow } = require('electron');

const win = new BrowserWindow({ width: 800, height: 1500 });
win.loadURL('https://github.com');

const contents = win.webContents;
console.log(contents);
```

Como el módulo **BrowserWindow** es un **EventEmitter**, podemos añadir handlers para eventos del usuario (como por ejemplo minimizar o maximizar una ventana)
Cuando una instancia de un **BrowserWindow** es destruida, sus procesos **renderer** correspondientes también son terminados.

#### Ciclo de vida de la aplicación

El **main** también controla el ciclo de vida de la aplicación a través del módulo **app**. Este módulo tiene muchos eventos y métodos que se pueden usar para añadir comportamiento a la app.

#### APIs Nativas

Para añadir la funcianlidad de Electro más allá de ser un wrapper para contenido web, el **main** también incluye APIs customizables para interactuar con el sistema operativo del usuario. Electron provee varios modulos que controlan funcionalidades desktop nativas, como menús, diálogos y bandejas de íconos.

### El proceso renderer

Como ya dijimos, cada app de Electron crea un renderer separado para cada **BrowserWindow**. Como lo dice su nombre, este proceso es responsable de _renderizar_ contenido web. El código aquí debería comportarse de acuerdo a los estándares web.

Por eso, todas las interfaces y la funcionalidad en una ventana deberías ser escritas con las mismas herramientas y paradigmas que usamos en la web.

Esto también significa que el **renderer** no tiene acceso a ningún módulo o API de Node.js. Para incluir directamente modulos en el renderer, tenemos que usar bundlers como webpack o parcel ,como se usar en la web.

### El proceso utilitario

Cada app de Electron puede spawnear varios procesos hijos desde el proceso main usando la API de **UtilityProcess**. Este proceso corre en un runtime de Node.js, esto quiere decir que puede usar todos los modulos y la API de Node.js. El **Proceso utilitario** puede ser utizado para hostear servicios sospechosos, tareas que requieran uso intenso del cpu o componentes con probabilidad de crasheo.

Estos de otra manera podrían ser hosteados en el proceso main o spawneados utilizando la API de Node.js **child_process.fork**. La principal diferencia entre la API de Node y el **Proceso utilitario** es que el proceso utilitario puede establecer un canal de comunicación con un **renderer** utilizando **MessagePorts**. Siempre que tengamos la oportunidad, va a ser mejor utilizar la API de **UtilityProcess** antes que la de Node.js

### Alias de módulos de procesos específicos (Typescript)

El paquete npm de Electron también exporta subrutas que contienen subconjuntos de Electron. A la hora de usar typescript, para garantizar el type checking, conviene importarlos teniendo en cuenta esto:

- `electron/main` incluye todos los tipos para todos los modulos del **main process**
- `electron/renderer` incluye todos los tipos para todos los modulos del **renderer process**
- `electron/common` incluye los tipos para los modulos que pueden correr tanto en el main como en el renderer

### Aislación de contexto

#### ¿Qué es?

**Context isolation** o aislación del contexto es un feature que garantiza que los **Preload scripts** y la lógica interna de Electron corran en contextos diferentes a la página web que cargamos en **WebContents**. Esto es importante por razones de seguridad y ayuda a prevenir que el sitio web acceda al interior de Electron o a la API que tiene acceso mi **preload script**

Esto significa que el objeto **window** al que el preload script tiene acceso es **diferente** al objeto que el sitio web tiene acceso. Por ejemplo, si seteo `window.hola = 'saludar'` en el preload script y el **context isolation** está habilitado, `window.hola` va a ser **undefined** si la página web intenta acceder.

Esta feature esta habilitada por default desde Electron 12 y es recomendada por razones de seguridad para todas las aplicaciones.

#### Consideraciones de seguridad

Tan solo tener **ContextIsolation** habilitado y usar **ContextBridge** no significa que todo el código que escribamos sea seguro. Por ejemplo, este código no sería seguro:

```js
//preload.js
// ❌ Bad code
contextBridge.exposeInMainWorld('myAPI', {
  send: ipcRenderer.send,
});
```

expone directamente una API sin ningún argumento. Esto permitiría a cualquier sitio web a mandar mansages IPC, cosa que no queremos que pase. La manera correcta de exponer APIs basadas en IPC sería proveer un método por cada mensaje IPC:

```js
//preload.js
// ✅ Good code
contextBridge.exposeInMainWorld('myAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs'),
});
```

##### Uso con TypeScript

Si usamos ts para nuestra app nos conviene añadir tipos a las APIs expuestas en el ContextBridge. El objeto `window` del renderer no hace falta que tenga los tipos correctos a menos que extienda los tipos en un **archivo de declaración**. Por ejemplo: si tengo este `preload.ts`:

```ts
//preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs'),
});
```

Puedo crear un archivo de declaración `interface.d.ts` y globamente aumentar la interfaz `window`:

```ts
//interface.d.ts
export interface IElectronAPI {
  loadPreferences: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
```

De esta forma. aseguramos que el compilador de TypeScript sepa the la propiedad `electronAPI` en nuestro objeto global `window` cuando escribamos scripts en el renderer process.

### ¿Qué es un Preload Script?

Electron corre en una instancia de Node.js que tiene todos los accesos al sistema operativo. Encima de los **modulos de electron** también se puede acceder a los **Built-ins de Node.js**, así como también a cualquier paquete instalado por npm o pnpm. Por el otro lado, los **Renderer proccess** corrren páginas web y no corren en **Node.js** por una cuestión de seguridad

Para unir estos diferentes tipos de procesos, tendremos que utilizar un script especial llamado **Preload**

Un **Preload script** puede ser añadido al main en el constructor del **BrowserWindow** usando la opción **webPreferences**:

```js
//main.js
const { BrowserWindow } = require('electron');
// ...
const win = new BrowserWindow({
  webPreferences: {
    preload: 'path/to/preload.js',
  },
});
// ...
```

Debido a que los preload script comparten una interfaz global **Window** con los renderers y pueden acceder a las APIs de Node.js, sirven para mejorar los renderer al darles acceso arbitrario en el window global a APIs que mis contenidos web pueden consumir después.

Aunque los **Preload scripts** comparten un **window global** con el renderer al que estan vinculados, no se pueden añadir directamente cualqueir variable desde el preload por el default de **contextIsolation**. Context Isolation significa que los preload scripts estan aislados del renderer del contexto del main para evitar que se filtren APIs privilegiadas en el código de la página web. En vez de eso, para hacerlo de forma segura, hay que usar el módulo **contextBridge** que se trata más abajo.

#### Mejorar el Renderer con un preload script

Los **Preload Script** son inyectados a una página web ántes que el **Renderer**. Para añadir features al renderer que requieren de acceso con privilegios, podemos definir objetos **globales** a través de la API de **ContextBridge**

### Comunicación entre procesos.

Como se mencionó antes, el proceso Main de Electron y el renderer tienen diferentes responsabilidades y no son intercambiables. Esto significa que no se puede acceder a la API de Node.js de manera completa desde un renderer, ni tampoco se puede acceder de manera completa al HTML DOM desde el main.

La solución a este problema es utilizar los módulos **ipcMain** y **ipcRenderer** de Electron para comunicación entre procesos.
Para mandar un mensaje desde la página web al main, tenemos que setear un handler con `ipcMain.handle` y después exponer una función que llame a `ipcRenderer.invoke` para llamar al handle en el Preload.

#### Canales IPC

En Electron, los procesos se comunican pasando mensajes a través de canales definidos por los desarrolladores con la ayuda de los módulos **ipcMain** y **ipcRenderer**.

Hay ciertos patrones que se utilizan en la mayoría de las aplicaciones:

##### Patrón 1. Renderer to main (one-way)

Para mandar un mensaje IPC solo de ida desde un proceso renderer hacia un proceso main, utilizamos el API **ipcRenderer.send** que después es recibido en la API **ipcMain.on**.

Este patrón se usa generalmente para llamar a un proceso principal desde la web.[Ver ejemplo](https://fiddle.electronjs.org/launch?target=electron/v37.2.6/docs/fiddles/ipc/pattern-1)

##### Patron 2. Renderer to main (two-way)

Una aplicación común para un IPC de ida y vuelta es llamar a un proceso del main desde el renderer y esperar un resultado. Esto puede hacerse usando **ipcRenderer.invoke** en combinación con **ipcMain.handle**

Un ejemplo de esto puede verse [Acá](https://fiddle.electronjs.org/launch?target=electron/v37.2.6/docs/fiddles/ipc/pattern-2)

##### Patrón 3. Main to renderer

Cuando mandamos un mensaje del main al renderer tenemos que especificar cual renderer recibe el mensaje. Los mensajes tienen que ser mandados del main al renderer a través de la instancia de **WebContents**. Esta instancia tiene un método **send** que puede ser utilizado de la misma manera que **ipcRenderer.send**

Un ejemploo puede verse [Acá](https://fiddle.electronjs.org/launch?target=electron/v37.2.6/docs/fiddles/ipc/pattern-3)

#### Patrón 4. Renderer to renderer

No hay una manera directa de mandar mensajes entre renderers en electron usando **ipcMain y ipcRenderer**. Para lograr esto hay dos opciones:

- Usar el main como un mensajero entre renderers. Esto implicaría mandar un mensaje de un renderer al main y después hacer que el main le mande el mensaje al otro renderer
- Pasar un **MessagePort** desde el main hacia ambos renderers. Esto lograría una comunicación directa entre los renderers después del setup inicial

### Process Sandboxing

Una feature clave de Chromium es que los procesos pueden ser ejecutados dentro de un **sandbox**. El _sandbox_ limita el daño que el código malicioso puede causar ,limitando el acceso a los recursos del sistema. Los procesos sandboxeados solo pueden usar de manera libre ciclos del CPU y memoria. Para realizar operaciones que requieran más privilegios,e stos procesos usan canales de comunicacion dedicados para delegar tareas a procesos con más privilegios.

#### Sandbox behavior in Electron

Los procesos **sandboxeados** en Electron se comportan casi de la misma manera que en Chromium, la diferencia es que en Electron hay un par de cosas más a considerar porque interactúa con Node.js

##### Renderer en Sandbox

Cuando un renderer de Electron esta dentro de un sandbox, se comporta de la misma manera que un renderer de Chrome. Un renderer dentro de un sandbox no tiene una instancia de Node.js inicializada.

Debido a esto, cuando el sandbox está activado, los renderers solo pueden realizar las tareas que necesitan de privilegios pidiendoselo al main a través de IPC.

##### Preload Sripts en Sandbox

Para dejar que los renderers se comuniquen con el main, los **preload scripts** relacionados con los renderers sandboxeados todavía tienen un suboconjunto de APIs de Node.js disponibles. Existe una función `require` similar a la función de Node `require` pero esta solo puede importar un subconjunto de los modulos de Electron y de Node

### Como configurar el sandbox

Para la mayoría de las apps usar sandboxing es la mejor opción. En ciertos casos en que no se pueda hacer algo con el sandbox activado, es posible desactivarlo para ciertos procesos. Obviamente tendriamos que asumir que va a haber riesgos de seguridad, especificamente si hay código que no confiemos en el proceso.

**Cómo desactivarlo:**

```js
// main.js
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      sandbox: false,
    },
  });
  win.loadURL('https://google.com');
});
```

**Como activarlo de manera global:**

```js
//main.js
app.enableSandbox();
app.whenReady().then(() => {
  // any sandbox:false calls are overridden since `app.enableSandbox()` was called.
  const win = new BrowserWindow();
  win.loadURL('https://google.com');
});
```

### MessagePorts

Los **MessagePorts** son un feature web que permite pasar mensajes entre diferentes contextos. A continuación un breve ejemplo de que es un MessagePort y como funciona:

```js
//renderer.js
// MessagePorts are created in pairs. A connected pair of message ports is
// called a channel.
const channel = new MessageChannel();

// The only difference between port1 and port2 is in how you use them. Messages
// sent to port1 will be received by port2 and vice-versa.
const port1 = channel.port1;
const port2 = channel.port2;

// It's OK to send a message on the channel before the other end has registered
// a listener. Messages will be queued until a listener is registered.
port2.postMessage({ answer: 42 });

// Here we send the other end of the channel, port1, to the main process. It's
// also possible to send MessagePorts to other frames, or to Web Workers, etc.
ipcRenderer.postMessage('port', null, [port1]);
```

```js
//main.js
//In the main process, we receive the port.
ipcMain.on('port', (event) => {
  // When we receive a MessagePort in the main process, it becomes a
  // MessagePortMain.
  const port = event.ports[0];

  // MessagePortMain uses the Node.js-style events API, rather than the
  // web-style events API. So .on('message', ...) instead of .onmessage = ...
  port.on('message', (event) => {
    // data is { answer: 42 }
    const data = event.data;
  });

  // MessagePortMain queues messages until the .start() method has been called.
  port.start();
});
```

#### MessagePorts en el main

En el renderer, la clase `MessagePort` se comporta igual que en la web. En el main, como el main no es una página web, no tiene las clases `MessagePort` y `MessageChannel`. Para manejar y interactuar con los MessagePorts en el main, Electron añae dos clases: **`MessagePortMain`** y **`MessageChannelMain`**. Estos se comportan de manera muy similar a sus análogos en el renderer

Los objetos `MessagePort` pueden ser creados tanto en el renderer como en el main y pueden ser pasados de un lado al otro usando los métodos **`ipcRenderer.postMessage`** y **`WebContents.postMessage`**. Acordarse que los métodos IPC como `send` y `invoke` no pueden ser usados para transferir `MessagePorts`, solo los métodos `postMessage` y `MessagePort` pueden usarse para eso

Pasando `MessagePort` a través del main, pueden comunicarse dos páginas que de otra manera no serían capaces de comunicarse.

#### `close` event

Electron le añade un feature a `MessagePort` que no está presente en la web, apra hacer los MessagePorts más útiles. Este feature es el `close` event, que es emitido cuando algún extremo del canal se cierra, los canales también pueden ser cerrados por el garbage-collector

En el renderer, podes escuchar el `close` event asignando algo al `port.onclose` ó llamando a `port.addEventListener('close',...)`. En el main podes escuchar al `close` event llamando al `port.on('close',...)`

[Para ejemplos entrar acá](https://www.electronjs.org/docs/latest/tutorial/message-ports#example-use-cases)

### ¿Cómo añadir complejidad a la aplicación?

Una vez que tenemos andando nuestra aplicación básica con electron, se puede decir que podemos tomar dos caminos:

1. Añadir complejidad al código del renderer
2. Añadir integraciones más complejas con el sistema operativo y Node.js

Es importante que entendamos la diferencia entre estos dos caminos. Para el primero no se necesita ningún recurso específico de electron. Por ejemplo, hacer una to-do-list lindaes solo hacer que el **BrowserWindow** sea una to-do-list web. De esta manera terminas usando las mismas herramientas que utilizarías para hacer algo en la web (HTML,CSS y JS)

Por el otro lado, Electron provee muchas herramientas que nos permiten integrarnos con el desktop environment. También nos da todo el poder que implica correr el main en Node.js. Estas herramientas son las que separan electron de simplemente **"Correr un simple navegador""** y es en lo que se centra la documentación de Electron

### ¿Cómo empaquetar la aplicación?

Electron no tiene ninguna herramienta para distribución y empaquetamiento en sus modulos core. Una vez que tengamos nuestra app andando en dev mode, tenemos que usar herramientas adicionales para crear una app empaquetada que podamos distribuir a los usuarios (Conocida como **Distributable o Ejecutable**).

**Electron Forge** es una herramienta que maneja todo, tanto el empaquetamiento como la distribución. Para usarlo tenemos que importarlo en nuestras dependencias de desarrollo:

```shell
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

Ahora en el package.json tenemos los scripts:

```
  //...
  "scripts": {
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make"
  },
  //...
```

Para crear un **Distributable** usamos el nuevo script 'make'. Después de que corra tenemos una carpeta 'out' que contiene tanto el distribuible como el código empaquetado

#### Firmar el código

Para distribuir apps desktop a usuarios finales, se recomienda **'Firmar el código'** de nuestra app. Esta es una parte importante del shipping de las aplicaciones y es obligatorio para el auto-update que se explicará después.

**Code Signing** es una tecnología de seguridad utilizada para certificar que una app fue creada por una fuente conocida. Windows y macOS tienen sus sistemas específicos de 'Code Signing', los cuales le hacen más dificil a los usuarios descargar or ejecutar apps que no esten firmadas.

En macOS se firma el código al nivel de empaquetamiento. En Windows se firman los Distributables. [Más info](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging).

### Publicación y Actualización

Los **'mantainers'** de Electron brindan un servicio gratis de **'auto-updating'** para apps open-source [Link Acá](https://github.com/electron/update.electronjs.org). Los requerimientos son:

- La app corre en macOS ó Windows
- La app tiene un repositorio de Github público
- Las Builds son publicadas a [Github releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- Las builds estan [firmadas](https://www.electronjs.org/docs/latest/tutorial/code-signing)

#### ¿Cómo publicar una release?

Electron Forge tiene un plugin [Publisher](https://www.electronforge.io/config/publishers) que puede automatizar la distribución de tu aplicación empaquetada a varias fuentes. Con esta herramienta, y utilizando además [Github Publisher](https://www.electronforge.io/config/publishers/github)
se puede publicar la app y configurarla para usar el servicio de Auto-Actualización de Electron.
