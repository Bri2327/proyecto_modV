<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-box">
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-text">{{ message }}</p>

      <div class="modal-actions">
        <button class="btn btn-secondary" @click="$emit('cancel')">
          Cancelar
        </button>
        <button class="btn btn-danger" @click="$emit('confirm')">
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: "Confirmación",
  },
  message: {
    type: String,
    default: "¿Estás seguro de realizar esta acción?",
  },
});

defineEmits(["confirm", "cancel"]);
</script>