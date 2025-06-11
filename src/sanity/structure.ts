// import type {StructureResolver} from 'sanity/structure'

// // https://www.sanity.io/docs/structure-builder-cheat-sheet
// export const structure: StructureResolver = (S) =>
//   S.list()
//     .title('Content')
//     .items(S.documentTypeListItems())

import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton Shipping Settings
      S.listItem()
        .title("Shipping Settings")
        .icon(() => "🚚") // optional emoji icon
        .child(
          S.editor()
            .id("shippingSettings")
            .schemaType("shippingSettings")
            .documentId("shippingSettings") // this forces it to be singleton
        ),

      // Divider (optional)
      S.divider(),

      // All other document types (e.g. products, orders, etc.)
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== "shippingSettings"
      ),
    ]);
