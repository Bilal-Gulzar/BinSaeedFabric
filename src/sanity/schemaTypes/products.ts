import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      title: "thumbnail",
    }),
    defineField({
      name: "sizes",
      type: "array",
      title: "Sizes",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Small", value: "Small" },
          { title: "Medium", value: "Medium" },
          { title: "Large", value: "Large" },
          { title: "Extra Large", value: "Extra Large" },
        ],
      },
      initialValue: [],
    }),
    defineField({
      name: "productImages",
      title: "Product Images",
      type: "array",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: {
            hotspot: true,
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: "price",
      type: "number",
      title: "Current Price",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "qty",
      type: "number",
      title: "Quantity",
      initialValue: 0,
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [
        defineField({
          name: "tag",
          type: "string",
        }),
      ],
      initialValue: [],
    }),
    defineField({
      name: "originalPrice",
      type: "number",
      title: "Original Price",
      initialValue: 0,
    }),
    defineField({
      name: "isNew",
      type: "boolean",
      title: "New Badge",
      initialValue: true,
    }),
  ],
});
