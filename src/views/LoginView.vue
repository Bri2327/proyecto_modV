<template>
  <div class="container">
    <div class="card auth-box">
      <h2 class="section-title">Iniciar sesión</h2>
      <p class="subtitle">Ingresa con tu correo y contraseña</p>

      <form class="form-grid" @submit.prevent="handleLogin">
        <input v-model="form.email" class="input" type="email" placeholder="Correo" required />
        <input v-model="form.password" class="input" type="password" placeholder="Contraseña" required />
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? "Ingresando..." : "Ingresar" }}
        </button>
      </form>

      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../services/authService";

const router = useRouter();
const message = ref("");
const loading = ref(false);

const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    loading.value = true;
    message.value = "";

    const res = await loginUser(form);
    localStorage.setItem("token", res.data.accessToken);
    window.dispatchEvent(new Event("auth-changed"));
    message.value = "Login exitoso";
    router.push("/productos");
  } catch (error) {
    console.error("Error en login:", error);
    message.value = "Credenciales incorrectas";
  } finally {
    loading.value = false;
  }
};
</script>