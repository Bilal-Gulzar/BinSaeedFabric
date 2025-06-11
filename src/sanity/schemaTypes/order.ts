export default {
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    {
      name: "customerName",
      type: "string",
      title: "Customer Name",
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
    },
    {
      name: "address",
      type: "text",
      title: "Address",
    },
    {
      name: "city",
      type: "string",
      title: "City",
    },
    {
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
    },
    {
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "paymentMethod",
      type: "string",
      title: "Payment Method",
      options: {
        list: [
          { title: "Cash on Delivery", value: "cod" },
          { title: "Stripe", value: "stripe" },
        ],
      },
    },
    {
      name: "paymentStatus",
      type: "string",
      title: "Payment Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Cancelled", value: "cancelled"},
          { title: "Delivered", value: "Delivered"},
          { title: "Confirmed", value: "confirmed"},
        ],
        layout: "radio", // optional: makes it easier to select
      },
      initialValue: "pending",
    },
    {
      name: "isPaid",
      type: "boolean",
      title: "Is Paid?",
      initialValue: false,
    },
    {
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
    },
    {
      name: "shippingFee",
      title: "ShippingFee",
      type: "number",
    },
    {
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    },
    {
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "productName",
              title: "ProductName",
              type: "string",
            },
            {
              name: "id",
              title: "id",
              type: "string",
            },
            {
              name: "size",
              title: "size",
              type: "string",
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "quantity",
              title: "Quantit",
              type: "number",
            },
            {
              name: "price",
              title: "Price",
              type: "number",
            },
          ],
        },
      ],
    },
  ],
};
