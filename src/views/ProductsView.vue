<template>
  <div class="container">
    <div class="card">
      <h2 class="section-title">Gestión de Productos</h2>
      <p class="subtitle">Crea, edita, busca y filtra productos</p>

      <form class="form-grid" @submit.prevent="saveProduct">
        <div class="form-row">
          <input v-model="form.nombre" class="input" placeholder="Nombre" required />
          <input v-model.number="form.precio" class="input" type="number" placeholder="Precio" required />
        </div>

        <div class="form-row">
          <input v-model.number="form.stock" class="input" type="number" placeholder="Stock" required />
          <select v-model.number="form.categoriaId" class="select" required>
            <option disabled value="">Seleccione categoría</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <textarea v-model="form.descripcion" class="textarea" placeholder="Descripción"></textarea>

        <div class="actions">
          <button class="btn btn-primary" type="submit">
            {{ editing ? "Actualizar" : "Guardar" }}
          </button>

          <button
            v-if="editing"
            class="btn btn-secondary"
            type="button"
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="card">
      <h3 class="section-title">Buscar y filtrar</h3>

      <div class="filters">
        <input
          v-model="search"
          class="input"
          placeholder="Buscar producto por nombre"
        />

        <select v-model.number="selectedCategory" class="select">
          <option :value="0">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>

      <div v-if="filteredProducts.length === 0" class="empty">
        No se encontraron productos
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in filteredProducts" :key="prod.id">
              <td>{{ prod.nombre }}</td>
              <td>Bs {{ prod.precio }}</td>
              <td>{{ prod.stock }}</td>
              <td>
                <span class="badge">{{ getCategoryName(prod.categoriaId) }}</span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn btn-secondary" @click="editProduct(prod)">Editar</button>
                  <button class="btn btn-danger" @click="askDeleteProduct(prod.id)">Eliminar</button>
                  <router-link class="btn btn-primary" :to="`/productos/${prod.id}`">
                    Detalle
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Eliminar producto"
      message="¿Seguro que deseas eliminar este producto?"
      @confirm="removeProduct"
      @cancel="cancelDeleteProduct"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";
import { getCategories } from "../services/categoryService";

const products = ref([]);
const categories = ref([]);
const editing = ref(false);
const currentId = ref(null);
const search = ref("");
const selectedCategory = ref(0);
const showDeleteModal = ref(false);
const productToDelete = ref(null);

const form = reactive({
  nombre: "",
  precio: null,
  stock: null,
  descripcion: "",
  categoriaId: "",
});

const loadData = async () => {
  try {
    const resProducts = await getProducts();
    const resCategories = await getCategories();
    products.value = resProducts.data;
    categories.value = resCategories.data;
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

const saveProduct = async () => {
  try {
    if (editing.value) {
      await updateProduct(currentId.value, form);
    } else {
      await createProduct(form);
    }

    cancelEdit();
    await loadData();
  } catch (error) {
    console.error("Error al guardar producto:", error);
  }
};

const editProduct = (prod) => {
  form.nombre = prod.nombre;
  form.precio = prod.precio;
  form.stock = prod.stock;
  form.descripcion = prod.descripcion;
  form.categoriaId = prod.categoriaId;
  currentId.value = prod.id;
  editing.value = true;
};

const cancelEdit = () => {
  form.nombre = "";
  form.precio = null;
  form.stock = null;
  form.descripcion = "";
  form.categoriaId = "";
  currentId.value = null;
  editing.value = false;
};

const askDeleteProduct = (id) => {
  productToDelete.value = id;
  showDeleteModal.value = true;
};

const removeProduct = async () => {
  try {
    if (!productToDelete.value) return;

    await deleteProduct(productToDelete.value);
    showDeleteModal.value = false;
    productToDelete.value = null;
    await loadData();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
};

const cancelDeleteProduct = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const getCategoryName = (id) => {
  const category = categories.value.find((c) => c.id === id);
  return category ? category.nombre : "Sin categoría";
};

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const byName = p.nombre.toLowerCase().includes(search.value.toLowerCase());
    const byCategory = selectedCategory.value
      ? p.categoriaId === selectedCategory.value
      : true;

    return byName && byCategory;
  });
});

onMounted(loadData);
</script>