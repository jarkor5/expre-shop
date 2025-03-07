export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isfeatured: boolean;
}



export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("http://127.0.0.1:8001/products")
    if (!response.ok) {
throw new Error("Server responded with an error!")
  }
  return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
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