import { apiSlice } from "../../app/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "AdminOrders"],
    }),
    getMyOrders: builder.query({
      query: () => "/orders/myOrders",
      providesTags: ["User"],
    }),
    getAdminOrders: builder.query({
      query: () => "/orders/admin/all",
      providesTags: ["AdminOrders"],
    }),
    getSellerOrders: builder.query({
      query: () => "/orders/seller/all",
      providesTags: ["SellerOrders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminOrders", "SellerOrders"],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetAdminOrdersQuery,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
} = orderApi;
