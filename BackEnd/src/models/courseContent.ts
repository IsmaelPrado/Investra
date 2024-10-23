// Importamos la conexión a la base de datos
import pool from '../config';

// Interfaz para la tabla Modulos
export interface Module {
  ModuloID: number; // ID del módulo
  CursoID: number; // Referencia a Course
  Nombre: string; // Nombre del módulo
  Orden: number; // Indica el orden del módulo dentro del curso
}

// Interfaz para la tabla Submodulos
export interface Submodule {
  SubModuloID: number; // ID del submódulo
  ModuloID: number; // Referencia a Module
  Nombre: string; // Nombre del submódulo
  Orden: number; // Indica el orden del submódulo dentro del módulo
  TipoContenido: 'video' | 'lectura' | 'ambos' | 'ninguno'; // Tipo de contenido que se presenta
  URLContenido?: string; // URL del video o contenido multimedia
  URLImagen?: string; // URL de la imagen asociada (si existe)
  TextoContenido?: string; // Texto del contenido de aprendizaje
}

// Interfaz para la tabla Compras
export interface Purchase {
  CompraID: number; // ID único de la compra
  UsuarioID: number; // Referencia al ID del usuario
  CursoID: number; // Referencia al ID del curso
  FechaCompra?: Date; // Fecha de la compra (opcional)
}

// Método para obtener los IDs de los cursos comprados por un usuario
export async function getPurchasedCourseIds(userId: number): Promise<number[]> {
  try {
    const query = `
      SELECT DISTINCT cursoid as "CursoID"
      FROM compras
      WHERE usuarioid = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    
    // Devolver solo los IDs de los cursos como un arreglo de números
    return rows.map(row => row.CursoID);
  } catch (error) {
    console.error('Error al obtener los IDs de cursos comprados:', error);
    throw new Error('Error al acceder a la base de datos');
  }
}

// Método para obtener los detalles de los cursos a partir de sus IDs
export async function getCourseDetailsByIds(courseIds: number[]): Promise<any[]> {
  if (courseIds.length === 0) return []; // Retornar vacío si no hay IDs

  // Convertir el array de courseIds a un formato adecuado para la consulta SQL
  const courseIdsList = courseIds.join(',');

  const query = `
      SELECT CursoID, Nombre, Descripcion, Precio, Duracion, URLImagen, 
             FechaCreacion, Calificacion, Nivel, Autor, Idioma, Aprendizajes 
      FROM cursos 
      WHERE CursoID IN (${courseIdsList})  -- Filtrar por los cursos comprados
  `;

  try {
      const { rows } = await pool.query(query);
      return rows; // Devolver los detalles de los cursos
  } catch (error) {
      console.error('Error al obtener los detalles de los cursos:', error);
      throw new Error('Error al acceder a la base de datos');
  }
}

// Método para obtener módulos de un curso específico
export async function getModules(courseId: number): Promise<any[]> {
  const query = `
      SELECT 
         *
    
      FROM modulos
      WHERE CursoID = $1 
  
  `;

  try {
      const { rows } = await pool.query(query, [courseId]);
      return rows; // Devolver solo los módulos
  } catch (error) {
      console.error('Error al obtener los módulos:', error);
      throw new Error('Error al acceder a la base de datos');
  }
}

// Método para obtener submódulos de un curso específico
export async function getSubmodules(courseId: number): Promise<any[]> {
  const query = `
      SELECT 
          SubModuloID, 
          ModuloID,
          Nombre AS SubModuloNombre, 
          Orden AS SubModuloOrden, 
          TipoContenido, 
          URLContenido, 
          URLImagen, 
          TextoContenido
      FROM submodulos
      WHERE ModuloID IN (
          SELECT ModuloID FROM modulos WHERE CursoID = $1
      )
      ORDER BY ModuloID, Orden; -- Asegúrate de que estén ordenados por módulo y orden
  `;

  try {
      const { rows } = await pool.query(query, [courseId]);
      return rows; // Devolver solo los submódulos
  } catch (error) {
      console.error('Error al obtener los submódulos:', error);
      throw new Error('Error al acceder a la base de datos');
  }
}






