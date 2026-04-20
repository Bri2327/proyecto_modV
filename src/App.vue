<template>
  <div class="page">
    <header class="navbar">
      <div class="navbar-content">
        <div class="brand">Mi Tienda Vue 3</div>

        <nav class="nav-links">
          <router-link class="nav-link" to="/">Inicio</router-link>
          <router-link v-if="isAuthenticated" class="nav-link" to="/categorias">Categorías</router-link>
          <router-link v-if="isAuthenticated" class="nav-link" to="/productos">Productos</router-link>
          <router-link v-if="!isAuthenticated" class="nav-link" to="/login">Login</router-link>
          <router-link v-if="!isAuthenticated" class="nav-link" to="/register">Registro</router-link>
          <button v-if="isAuthenticated" class="btn btn-danger" @click="logout">Salir</button>
        </nav>
      </div>
    </header>

    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(!!localStorage.getItem("token"));

const updateAuth = () => {
  isAuthenticated.value = !!localStorage.getItem("token");
};

const logout = () => {
  localStorage.removeItem("token");
  updateAuth();
  window.dispatchEvent(new Event("auth-changed"));
  router.push("/login");
};

onMounted(() => {
  window.addEventListener("auth-changed", updateAuth);
  updateAuth();
});

onUnmounted(() => {
  window.removeEventListener("auth-changed", updateAuth);
});
</script>