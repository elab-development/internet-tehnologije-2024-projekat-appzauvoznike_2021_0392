// src/api/supplier.js
import api from "./axios";

// PRODUCTS
export const fetchMyProducts = () => api.get("/supplier/products");
export const searchMyProducts = (params) => api.get("/supplier/products-search", { params });
export const createProduct = (payload) => api.post("/supplier/products", payload);
export const updateProduct = (id, payload) => api.put(`/supplier/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/supplier/products/${id}`);

// PRODUCT IMAGES
export const listImages = (productId) => api.get(`/supplier/products/${productId}/images`);
export const uploadImage = (productId, formData) =>
  api.post(`/supplier/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateImage = (productId, imageId, formData) =>
  api.post(`/supplier/products/${productId}/images/${imageId}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteImage = (productId, imageId) =>
  api.delete(`/supplier/products/${productId}/images/${imageId}`);

// OFFERS
export const fetchMyOffers = () => api.get("/supplier/offers");
export const createOffer = (payload) => api.post("/supplier/offers", payload);
export const updateOffer = (id, payload) => api.put(`/supplier/offers/${id}`, payload);
export const deleteOffer = (id) => api.delete(`/supplier/offers/${id}`);

// OFFER ITEMS
export const addOfferItem = (offerId, payload) => api.post(`/supplier/offers/${offerId}/items`, payload);
export const updateOfferItem = (offerId, itemId, payload) =>
  api.put(`/supplier/offers/${offerId}/items/${itemId}`, payload);
export const deleteOfferItem = (offerId, itemId) =>
  api.delete(`/supplier/offers/${offerId}/items/${itemId}`);
