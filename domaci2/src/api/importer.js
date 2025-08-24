import api from "./axios";

/* ========== SUPPLIERS SEARCH ========== */
export const searchSuppliers = (params) =>
  api.get("/importer/suppliers/search", { params });

/* ========== PARTNERSHIPS ========== */
export const listPartnerships = () =>
  api.get("/importer/partnerships");
export const createPartnership = (payload) =>
  api.post("/importer/partnerships", payload);
export const updatePartnership = (id, payload) =>
  api.put(`/importer/partnerships/${id}`, payload);
export const deletePartnership = (id) =>
  api.delete(`/importer/partnerships/${id}`);
export const getPartnership = (id) =>
  api.get(`/importer/partnerships/${id}`);

/* ========== PRODUCTS / OFFERS (READ-ONLY) ========== */
export const listPartnerProducts = (params) =>
  api.get("/importer/products", { params });
export const listPartnerOffers = (params) =>
  api.get("/importer/offers", { params });

/* ========== CONTAINERS ========== */
export const listContainers = () =>
  api.get("/importer/containers");
export const getContainer = (id) =>
  api.get(`/importer/containers/${id}`);
export const createContainer = (payload) =>
  api.post("/importer/containers", payload);
export const updateContainer = (id, payload) =>
  api.put(`/importer/containers/${id}`, payload);
export const deleteContainer = (id) =>
  api.delete(`/importer/containers/${id}`);

export const addContainerItem = (containerId, payload) =>
  api.post(`/importer/containers/${containerId}/items`, payload);
export const updateContainerItem = (containerId, itemId, payload) =>
  api.put(`/importer/containers/${containerId}/items/${itemId}`, payload);
export const deleteContainerItem = (containerId, itemId) =>
  api.delete(`/importer/containers/${containerId}/items/${itemId}`);
