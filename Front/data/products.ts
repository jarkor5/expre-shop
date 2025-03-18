const API_BASE_URL= 'http://127.0.0.1:8001'

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isfeatured: boolean;
  category?: string;
  brand?: string;
  technicalDetails?: string;
}

// Obtener productos paginados
export const fetchProductsPaginated = async (
  page: number,
  limit: number
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/paginated?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener productos paginados");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Obtener productos filtrados (versión paginada)
export const fetchProductsFiltered = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/paginated${query}`);
    if (!response.ok) {
      throw new Error("Error al obtener productos filtrados");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Obtener filtros (categorías y marcas)
export const fetchFilters = async (
  category?: string
): Promise<{ categories: string[]; brands: string[] }> => {
  try {
    let url = `${API_BASE_URL}/filters`; 
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener filtros");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { categories: [], brands: [] };
  }
};

// Obtener productos destacados (isfeatured)
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Error al obtener los productos destacados");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Obtener producto por id
export const fetchProductById = async (
  id: string | number
): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener producto con id ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};


export const fetchSimilarProducts = async (
  productId: string | number
): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/similar`);
    if (!response.ok) {
      throw new Error(`Error al obtener productos similares para id ${productId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
