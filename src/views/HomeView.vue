<template>
  <div class="container">
    <div class="hero">
      <div class="hero-box">
        <h1>Proyecto Final Vue 3</h1>
        <p>
          Sistema web para la gestión de productos y categorías, con autenticación,
          CRUD completo, filtro, buscador y rutas protegidas.
        </p>
        <router-link to="/login">
          <button class="btn btn-secondary">Comenzar</button>
        </router-link>
      </div>

      <div class="info-box">
        <h3>Funciones principales</h3>
        <ul class="info-list">
          <li>Registro e inicio de sesión</li>
          <li>CRUD de categorías</li>
          <li>CRUD de productos</li>
          <li>Filtro por categoría</li>
          <li>Búsqueda por nombre</li>
          <li>Ruta dinámica para detalle</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>