# StockSimulatorNG

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Docker

Este proyecto incluye un Dockerfile optimizado para producción con Nginx, listo para pipelines de CI/CD y despliegues automatizados.

### Características de Producción

- ✅ Build multi-stage para imagen final optimizada
- ✅ Nginx con configuración de producción
- ✅ Healthcheck integrado para monitoreo
- ✅ Headers de seguridad (XSS, CSP, etc.)
- ✅ Compresión gzip y caché optimizado
- ✅ Usuario no-root para mayor seguridad
- ✅ Proxy configurable para backend API
- ✅ SPA routing configurado correctamente

### Construir la imagen

```bash
docker build -t stock-simulator-angular .
```

### Ejecutar el contenedor

#### Windows/Mac (usa host.docker.internal por defecto)
```bash
docker run -p 80:80 stock-simulator-angular
```

#### Linux (necesitas especificar la URL del backend)
```bash
docker run -p 80:80 -e BACKEND_URL=http://172.17.0.1:8080 stock-simulator-angular
```

#### Con URL de backend personalizada
```bash
docker run -p 80:80 -e BACKEND_URL=http://tu-backend-url:8080 stock-simulator-angular
```

### Docker Compose

#### Producción
```bash
docker-compose up -d
```

#### Testing/CI/CD
```bash
docker-compose -f docker-compose.test.yml up -d
```

### Healthcheck

El contenedor incluye un endpoint de healthcheck:
```bash
curl http://localhost/health
```

### Configuración del Backend

Por defecto, el contenedor intenta conectarse al backend en `http://host.docker.internal:8080/api`. Puedes cambiar esto usando la variable de entorno `BACKEND_URL`:

- **Windows/Mac**: `host.docker.internal` funciona automáticamente
- **Linux**: Usa la IP del host Docker (típicamente `172.17.0.1`) o el nombre del servicio si usas docker-compose
- **Docker Compose**: Usa el nombre del servicio (ej: `http://backend:8080`)

### CI/CD Pipeline

El proyecto incluye un workflow de GitHub Actions (`.github/workflows/docker-build-test.yml`) que:
- Construye la imagen Docker automáticamente
- Ejecuta tests básicos del contenedor
- Verifica el healthcheck
- Usa caché para builds más rápidos

Para usar en otros sistemas CI/CD:

```bash
# Build
docker build -t stock-simulator-angular:test .

# Test básico
docker run -d -p 8080:80 --name test-container stock-simulator-angular:test
sleep 5
curl -f http://localhost:8080/health || exit 1
docker logs test-container
docker stop test-container && docker rm test-container
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
