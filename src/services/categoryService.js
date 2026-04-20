import api from "./api";

export const getCategories = () => api.get("/categorias");
export const createCategory = (data) => api.post("/categorias", data);
export const updateCategory = (id, data) => api.put(`/categorias/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categorias/${id}`);