// /services/categoriaService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Categoria {
  id: number;
  nombre: string;
}

export interface CategoriasResponse {
  success: boolean;
  data: Categoria[];
}

export interface CategoriaResponse {
  success: boolean;
  data?: Categoria;
  message?: string;
}

export interface CreateCategoriaRequest {
  nombre: string;
}

export interface UpdateCategoriaRequest {
  nombre: string;
}

// 🚀 Servicio para obtener todas las categorías
export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.get<CategoriasResponse>(
      `${API_URL}/api-beta/categorias`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorMessage = error.response.data.message || error.response.data.error?.message;
      throw new Error(errorMessage || "No se pudieron cargar las categorías");
    }
    throw new Error("No se pudieron cargar las categorías");
  }
};

// 🚀 Servicio para obtener una categoría por ID
export const getCategoriaById = async (id: number): Promise<Categoria> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.get<CategoriaResponse>(
      `${API_URL}/api-beta/categorias/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Categoría no encontrada");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Categoría no encontrada");
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message;
      throw new Error(errorMessage || "No se pudo cargar la categoría");
    }
    throw new Error("No se pudo cargar la categoría");
  }
};

// 🚀 Servicio para crear una categoría
export const createCategoria = async (
  data: CreateCategoriaRequest
): Promise<Categoria> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.post<CategoriaResponse>(
      `${API_URL}/api-beta/categorias`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "No se pudo crear la categoría");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error creando categoría:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error("Ya existe una categoría con ese nombre");
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message;
      throw new Error(errorMessage || "No se pudo crear la categoría");
    }
    throw new Error("No se pudo crear la categoría");
  }
};

// 🚀 Servicio para actualizar una categoría
export const updateCategoria = async (
  id: number,
  data: UpdateCategoriaRequest
): Promise<Categoria> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.put<CategoriaResponse>(
      `${API_URL}/api-beta/categorias/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "No se pudo actualizar la categoría");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Categoría no encontrada");
      }
      if (error.response?.status === 409) {
        throw new Error("Ya existe otra categoría con ese nombre");
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message;
      throw new Error(errorMessage || "No se pudo actualizar la categoría");
    }
    throw new Error("No se pudo actualizar la categoría");
  }
};

// 🚀 Servicio para eliminar una categoría
export const deleteCategoria = async (id: number): Promise<Categoria> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.delete<CategoriaResponse>(
      `${API_URL}/api-beta/categorias/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "No se pudo eliminar la categoría");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Categoría no encontrada");
      }
      if (error.response?.status === 409) {
        // El mensaje del servidor debería incluir cuántos productos usan la categoría
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error?.message ||
                            "No se puede eliminar la categoría porque está siendo usada por productos";
        throw new Error(errorMessage);
      }
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message;
      throw new Error(errorMessage || "No se pudo eliminar la categoría");
    }
    throw new Error("No se pudo eliminar la categoría");
  }
};

