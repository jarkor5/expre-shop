export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isfeatured: boolean;
  category?: string;
  brand?: string;
}





export const fetchProductsPaginated = async (page: number, limit: number): Promise<Product[]> => {
  try {
    const response = await fetch(`http://127.0.0.1:8001/products/paginated?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Error al obtener productos paginados");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const fetchProductsFiltered  = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`http://127.0.0.1:8001/products/paginated${query}`)
    if (!response.ok) {
      throw new Error("Error al obtener productos filtrados")
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  
  }
}

export const fetchFilters = async (category?: string): Promise<{ categories: string[]; brands: string[] }> => {
  try {
    let url = "http://127.0.0.1:8001/filters";
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

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("http://127.0.0.1:8001/products")
    if (!response.ok){
      throw new Error("Error al obtener los productos destacados")
    }
    return await response.json()
  }
  catch (error){
    console.error(error)
    return []
  }
}


export const fetchProductById = async (id: string | number): Promise<Product | null> => {
  try {
    const response = await fetch (`http://127.0.0.1:8001/products/${id}`)
    if (!response.ok){
      throw new Error(`Error al obtener producto con id ${id}`)
    }
    return await response.json()
  } catch (error){
    console.error(error)
    return null
  }
}

