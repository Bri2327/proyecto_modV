<template>
  <div class="container">
    <div class="card">
      <h2 class="section-title">Gestión de Categorías</h2>
      <p class="subtitle">Administra las categorías del sistema</p>

      <form class="form-grid" @submit.prevent="saveCategory">
        <input v-model="form.nombre" class="input" placeholder="Nombre" required />
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
      <h3 class="section-title">Lista de Categorías</h3>

      <div v-if="categories.length === 0" class="empty">
        No hay categorías registradas
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td>{{ cat.id }}</td>
              <td>{{ cat.nombre }}</td>
              <td>{{ cat.descripcion }}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-secondary" @click="editCategory(cat)">Editar</button>
                  <button class="btn btn-danger" @click="askDeleteCategory(cat.id)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Eliminar categoría"
      message="¿Seguro que deseas eliminar esta categoría?"
      @confirm="removeCategory"
      @cancel="cancelDeleteCategory"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryService";

const categories = ref([]);
const editing = ref(false);
const currentId = ref(null);
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);

const form = reactive({
  nombre: "",
  descripcion: "",
});

const loadCategories = async () => {
  try {
    const res = await getCategories();
    categories.value = res.data;
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
};

const saveCategory = async () => {
  try {
    if (editing.value) {
      await updateCategory(currentId.value, form);
    } else {
      await createCategory(form);
    }

    cancelEdit();
    await loadCategories();
  } catch (error) {
    console.error("Error al guardar categoría:", error);
  }
};

const editCategory = (cat) => {
  form.nombre = cat.nombre;
  form.descripcion = cat.descripcion;
  currentId.value = cat.id;
  editing.value = true;
};

const cancelEdit = () => {
  form.nombre = "";
  form.descripcion = "";
  currentId.value = null;
  editing.value = false;
};

const askDeleteCategory = (id) => {
  categoryToDelete.value = id;
  showDeleteModal.value = true;
};

const removeCategory = async () => {
  try {
    if (!categoryToDelete.value) return;

    await deleteCategory(categoryToDelete.value);
    showDeleteModal.value = false;
    categoryToDelete.value = null;
    await loadCategories();
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
  }
};

const cancelDeleteCategory = () => {
  showDeleteModal.value = false;
  categoryToDelete.value = null;
};

onMounted(loadCategories);
</script>