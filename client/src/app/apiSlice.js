import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../utils/constants";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000" || API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Product", "User", "Admin", "AdminOrders", "SellerOrders"],
  endpoints: (builder) => ({}),
});
