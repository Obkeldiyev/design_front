import { api, tokenStore, API_URL } from "./client";
import type { Business, CanvasDoc, Design, User, Website } from "./types";

export const AuthAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => api.post("/auth/register", data).then((r) => r.data),
  refresh: (refreshToken: string) =>
    api.post("/auth/refresh-token", { refreshToken }).then((r) => r.data),
};

export const UserAPI = {
  profile: () => {
    if (!tokenStore.access) return Promise.reject(new Error("No auth token"));
    return api
      .get<{ success: boolean; user: User }>("/user/profile")
      .then((r) => r.data.user);
  },
  update: (data: Partial<User>) =>
    api
      .put<{ success: boolean; user: User }>("/user/profile", data)
      .then((r) => r.data.user ?? r.data),
};

export const BusinessAPI = {
  list: () =>
    api
      .get<{ success: boolean; businesses: Business[] }>("/business")
      .then((r) => r.data.businesses ?? []),
  get: (id: string) => api.get<Business>(`/business/${id}`).then((r) => r.data),
  create: (data: Partial<Business>) =>
    api.post<Business>("/business", data).then((r) => r.data),
  update: (id: string, data: Partial<Business>) =>
    api.put<Business>(`/business/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/business/${id}`).then((r) => r.data),
};

export const DesignAPI = {
  list: () =>
    api
      .get<{ success: boolean; designs: Design[] }>("/design")
      .then((r) => r.data.designs ?? []),
  get: (id: string) =>
    api
      .get<{ success: boolean; design: Design }>(`/design/${id}`)
      .then((r) => r.data.design),
  create: (data: {
    title: string;
    slug: string;
    type?: string;
    businessId?: string | null;
    data: CanvasDoc;
  }) =>
    api
      .post<{ success: boolean; design: Design }>("/design", data)
      .then((r) => r.data.design),
  update: (id: string, data: Partial<Design>) =>
    api
      .put<{ success: boolean; design: Design }>(`/design/${id}`, data)
      .then((r) => r.data.design),
  remove: (id: string) => api.delete(`/design/${id}`).then((r) => r.data),
};

export const WebsiteAPI = {
  list: () =>
    api
      .get<{ success: boolean; websites: Website[] }>("/website")
      .then((r) => r.data.websites ?? []),
  get: (id: string) =>
    api
      .get<{ success: boolean; website: Website }>(`/website/${id}`)
      .then((r) => r.data.website),
  create: (data: Partial<Website>) =>
    api
      .post<{ success: boolean; website: Website }>("/website", data)
      .then((r) => r.data.website),
  update: (id: string, data: Partial<Website>) =>
    api
      .put<{ success: boolean; website: Website }>(`/website/${id}`, data)
      .then((r) => r.data.website),
  remove: (id: string) => api.delete(`/website/${id}`).then((r) => r.data),
  /** Fetch a published site by subdomain — no auth required */
  getPublic: (subdomain: string) =>
    fetch(`${API_URL}/website/public/${subdomain}`)
      .then((r) => r.json())
      .then((d) => d.website as Website),
};

export const SuperAdminAPI = {
  stats: (secret: string) =>
    api
      .get("/superadmin/stats", { headers: { "X-SuperAdmin-Secret": secret } })
      .then((r) => r.data),
  login: (payload: { username?: string; email?: string; password: string }) =>
    api.post("/superadmin/login", payload).then((r) => r.data),
};
