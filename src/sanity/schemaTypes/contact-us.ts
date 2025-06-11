import { defineField, defineType } from 'sanity';

export default defineType({
  name: "contactUs",
  title: "contact-Us",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "comment",
      title: "Commnet",
      type: "text",
    }),
    {
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    },
  ],
});
