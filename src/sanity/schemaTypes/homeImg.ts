import { defineType, defineField } from "sanity";

export const HomeImage = defineType({
  name: "homeImg",
  title: "Home_Image",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "btn",
      type: "string",
      title: "Button_Text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
    }),
  ],
});