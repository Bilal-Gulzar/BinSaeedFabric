// schemas/shippingSettings.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "shippingSettings",
  title: "Shipping Settings",
  type: "document",
  fields: [
    defineField({
      name: "deliveryTime",
      title: "Delivery Time",
      type: "string",
      options: {
        list: [
          { title: "1–2 Days", value: "1-2 Days" },
          { title: "2–3 Days", value: "2-3 Days" },
          { title: "3–4 Days", value: "3-4 Days" },
          { title: "2–5 Days", value: "2-5 Days" },
          { title: "4–5 Days", value: "4-5 Days" },
          { title: "1 Week", value: "1 week" },
          { title: "2 Weeks", value: "2 weeks" },
        ],
      },
    }),
    defineField({
      name: "shippingFee",
      title: "Default Shipping Fee (RS)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
});
