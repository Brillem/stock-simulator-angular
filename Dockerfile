# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine AS build

# Metadatos
LABEL maintainer="Stock Simulator Team"
LABEL description="Stock Simulator Angular Frontend Application"

WORKDIR /app

# Copiar archivos de dependencias primero (mejora el caché de Docker)
COPY package.json package-lock.json ./

# Instalar todas las dependencias (necesarias para el build)
RUN npm ci && \
    npm cache clean --force

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Angular para producción con optimizaciones
RUN npm run build -- --configuration production

# Verificar que el build se completó correctamente
RUN if [ ! -d "dist/stock-simulator-ng/browser" ]; then \
      echo "ERROR: Build directory not found!" && exit 1; \
    fi

# Etapa 2: Servir con Nginx (imagen de producción optimizada)
FROM nginx:1.25-alpine

# Instalar herramientas de seguridad y limpieza
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Copiar el template de configuración de nginx
# Nginx-alpine procesa automáticamente archivos .template en /etc/nginx/templates/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar los archivos construidos desde la etapa de build
# Angular 18 genera los archivos en dist/stock-simulator-ng/browser/
COPY --from=build /app/dist/stock-simulator-ng/browser /usr/share/nginx/html

# Asegurar permisos correctos (nginx ya está configurado para ejecutar workers como usuario nginx)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Healthcheck para verificar que el contenedor está funcionando correctamente
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Nginx-alpine procesa automáticamente los templates al iniciar
CMD ["nginx", "-g", "daemon off;"]

