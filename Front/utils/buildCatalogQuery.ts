
export function buildCatalogQuery(
    page: number,
    limit: number,
    filters?: {
      category?: string;
      brand?: string;
    }
  ): string {
    let queryString = `?page=${page}&limit=${limit}`;
  
    if (filters?.category) {
      queryString += `&category=${encodeURIComponent(filters.category)}`;
    }
    if (filters?.brand) {
      queryString += `&brand=${encodeURIComponent(filters.brand)}`;
    }
  
    return queryString;
  }
  