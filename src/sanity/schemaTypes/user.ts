import { defineField, defineType } from 'sanity';

export default defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "fname",
      title: "First_Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lname",
      title: "Last_Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "password",
      title: "Password",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "postalcode",
      title: "postalCode",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
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
