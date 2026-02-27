const API_URL = "https://functions.poehali.dev/bfab6fca-05fc-488c-9d6d-ad3a714bd23d";

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

// Products
export const getProducts = (category?: string) =>
  request(`/products${category && category !== "Все" ? `?category=${encodeURIComponent(category)}` : ""}`);

export const createProduct = (body: object) =>
  request("/products", { method: "POST", body: JSON.stringify(body) });

export const updateProduct = (id: number, body: object) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteProduct = (id: number) =>
  request(`/products/${id}`, { method: "DELETE" });

// Orders
export const getOrders = (userId?: number) =>
  request(`/orders${userId ? `?user_id=${userId}` : ""}`);

export const createOrder = (body: object) =>
  request("/orders", { method: "POST", body: JSON.stringify(body) });

export const updateOrder = (id: number, body: object) =>
  request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(body) });

// Auth
export const login = (email: string, password: string) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const register = (name: string, email: string, password: string) =>
  request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });

export const getUsers = () => request("/users");

// Reviews
export const getReviews = (status?: string) =>
  request(`/reviews${status ? `?status=${status}` : ""}`);

export const createReview = (body: object) =>
  request("/reviews", { method: "POST", body: JSON.stringify(body) });

export const updateReview = (id: number, status: string) =>
  request(`/reviews/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
