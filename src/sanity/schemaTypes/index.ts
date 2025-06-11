import { type SchemaTypeDefinition } from 'sanity'
import { product } from './products'
import user from './user'
import order from './order'
import contactUs from './contact-us'
import { HomeImage } from './homeImg'
import shippingOptions from './shippingOptions'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    user,
    order,
    contactUs,
    HomeImage,
    shippingOptions,
  ],
};
