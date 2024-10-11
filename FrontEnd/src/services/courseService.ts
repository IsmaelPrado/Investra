// src/services/courseService.ts
const API_URL = 'http://localhost:3000/course/';

export const fetchCourses = async () => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }
  
  const data = await response.json();
  return data; // Devuelve la lista de cursos
};
