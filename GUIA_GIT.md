# 🚀 Guía para Subir el Proyecto a Git

## 📋 Pasos para Subir a un Nuevo Repositorio

### Paso 1: Crear el Repositorio en GitHub/GitLab

1. Ve a GitHub (github.com) o GitLab
2. Crea un **nuevo repositorio** (botón "New repository")
3. **NO inicialices** con README, .gitignore o licencia (ya tenemos archivos)
4. Copia la URL del repositorio (ejemplo: `https://github.com/tu-usuario/visualizador-reportes.git`)

### Paso 2: Inicializar Git en el Proyecto

Abre PowerShell o Terminal en la carpeta `visualizador-reportes` y ejecuta:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Visualizador de Reportes CSV"
```

### Paso 3: Conectar con el Nuevo Repositorio

```bash
# Agregar el nuevo repositorio remoto
git remote add origin https://github.com/tu-usuario/visualizador-reportes.git

# Verificar que se agregó correctamente
git remote -v
```

### Paso 4: Subir los Archivos

```bash
# Cambiar a la rama main (si es necesario)
git branch -M main

# Subir los archivos
git push -u origin main
```

---

## 🔄 Si Ya Tienes un Origin Configurado

Si por error ya tienes un origin configurado de otro repositorio, primero elimínalo:

```bash
# Ver el origin actual
git remote -v

# Eliminar el origin anterior
git remote remove origin

# Agregar el nuevo origin
git remote add origin https://github.com/tu-usuario/visualizador-reportes.git

# Verificar
git remote -v
```

---

## 📝 Comandos Completos (Copia y Pega)

```bash
# 1. Inicializar Git
git init

# 2. Agregar archivos
git add .

# 3. Primer commit
git commit -m "Initial commit: Visualizador de Reportes CSV"

# 4. Agregar remoto (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# 5. Subir
git branch -M main
git push -u origin main
```

---

## ⚠️ Si Tienes Problemas

### Error: "origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/tu-usuario/visualizador-reportes.git
```

### Error: "failed to push some refs"
```bash
# Si el repositorio remoto tiene contenido
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: Autenticación
- GitHub: Usa un **Personal Access Token** en lugar de contraseña
- O configura SSH keys

---

## 🌐 Después de Subir: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En "Source", selecciona **main** branch
5. Click **Save**
6. Tu sitio estará en: `https://tu-usuario.github.io/visualizador-reportes`

---

## ✅ Verificación

Después de subir, verifica que todos los archivos estén:
- ✅ index.html
- ✅ css/styles.css
- ✅ js/app.js
- ✅ js/csvParser.js
- ✅ README.md
- ✅ .gitignore

¡Listo! 🎉
