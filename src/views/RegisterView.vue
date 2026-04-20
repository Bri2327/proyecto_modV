<template>
  <div class="container">
    <div class="card auth-box">
      <h2 class="section-title">Registro</h2>
      <p class="subtitle">Crea una cuenta para ingresar al sistema</p>

      <form class="form-grid" @submit.prevent="handleRegister">
        <input v-model="form.email" class="input" type="email" placeholder="Correo" required />
        <input v-model="form.password" class="input" type="password" placeholder="Contraseña" required />
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrarse" }}
        </button>
      </form>

      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "../services/authService";

const router = useRouter();
const message = ref("");
const loading = ref(false);

const form = reactive({
  email: "",
  password: "",
});

const handleRegister = async () => {
  try {
    loading.value = true;
    message.value = "";

    const res = await registerUser(form);
    localStorage.setItem("token", res.data.accessToken);
    window.dispatchEvent(new Event("auth-changed"));
    message.value = "Registro exitoso";
    router.push("/productos");
  } catch (error) {
    console.error("Error en registro:", error);
    message.value = "Error al registrar usuario";
  } finally {
    loading.value = false;
  }
};
</script>