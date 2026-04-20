<template>
  <div class="container">
    <div v-if="loading" class="card">
      <p>Cargando producto...</p>
    </div>

    <div v-else-if="error" class="card">
      <p>{{ error }}</p>
      <router-link to="/productos" class="btn btn-primary">
        Volver
      </router-link>
    </div>

    <div class="card" v-else-if="product">
      <h2 class="section-title">Detalle del Producto</h2>

      <div class="detail-list">
        <p><strong>ID:</strong> {{ product.id }}</p>
        <p><strong>Nombre:</strong> {{ product.nombre }}</p>
        <p><strong>Precio:</strong> Bs {{ product.precio }}</p>
        <p><strong>Stock:</strong> {{ product.stock }}</p>
        <p><strong>Descripción:</strong> {{ product.descripcion }}</p>
        <p><strong>Categoría:</strong> {{ categoryName }}</p>
      </div>

      <router-link to="/productos" class="btn btn-primary">
        Volver
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getProductById } from "../services/productService";
import { getCategories } from "../services/categoryService";

const route = useRoute();
const product = ref(null);
const categories = ref([]);
const loading = ref(false);
const error = ref("");

const loadData = async () => {
  try {
    loading.value = true;
    error.value = "";

    const resProduct = await getProductById(route.params.id);
    const resCategories = await getCategories();

    product.value = resProduct.data;
    categories.value = resCategories.data;
  } catch (err) {
    console.error("Error al cargar detalle del producto:", err);
    error.value = "No se pudo cargar el producto";
    product.value = null;
  } finally {
    loading.value = false;
  }
};

const categoryName = computed(() => {
  if (!product.value) return "";
  const cat = categories.value.find((c) => c.id === product.value.categoriaId);
  return cat ? cat.nombre : "Sin categoría";
});

onMounted(loadData);

watch(() => route.params.id, loadData);
</script>