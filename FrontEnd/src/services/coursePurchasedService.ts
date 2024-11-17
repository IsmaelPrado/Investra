// src/services/courseService.ts

import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchPurchasedCourses = async (userId: number) => {
  try {
    const response = await axios.post(`${API_URL}/coursePurchased`, { userId });
    return response.data; // Devuelve la lista de cursos comprados
  } catch (error) {
    console.error('Error al obtener cursos comprados:', error);
    throw new Error('No se pudieron obtener los cursos comprados');
  }
};


export const fetchModuleCourse = async (courseId: number) => {
  try {
    const response = await axios.post(`${API_URL}/coursePurchased/module`, { courseId });
    return response.data; // Devuelve la lista de cursos comprados
  } catch (error) {
    console.error('Error al obtener modulos:', error);
    throw new Error('No se pudieron obtener los modulos');
  }
};


export const fetchSubModuleCourse = async (courseId: number) => {
  try {
    const response = await axios.post(`${API_URL}/coursePurchased/submodule`, { courseId });
    return response.data; // Devuelve la lista de cursos comprados
  } catch (error) {
    console.error('Error al obtener submodulos:', error);
    throw new Error('No se pudieron obtener los submodulos');
  }
};


// Método para comprar un curso
export const purchaseCourse = async (userId: number, courseId: number) => {
  try {
    const response = await axios.post(`${API_URL}/coursePurchased/comprar`, { userId, courseId });
    return response.data; // Devuelve el resultado de la compra
  } catch (error) {
    console.error('Error al comprar el curso:', error);
    throw new Error('No se pudo realizar la compra del curso');
  }
};