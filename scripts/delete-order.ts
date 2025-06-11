// ./scripts/delete-order.ts
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "fgz07r1m",
  dataset: "production",
  token:
    "skVK83q4TT1nm4nGd00yXrHeiWu8uVdRddNdBBiFUTPYkoO2iMZhJKm4tkASsoVOVyJhYB7zzZmfoBawGKauRv4QAFGr0dlrmGJq3joIelHnpivsEUbyfgmTEYfwOjowXNWd0inF97mJNePvD4FORiNWjeyneZjmQMmxfjQzbYnsiVXdjPG0", // must have delete permissions
  useCdn: false,
});

const orderId = "mGuYZ52WCGE15ngsaALDgk";
const referencingDocId = "drafts.orderManager";

// async function deleteOrder(orderId: string) {
//   try {
//     const result = await client.delete(orderId);
//     console.log("Deleted:", result);
//   } catch (err) {
//     console.error("Failed to delete:", err);
//   }
// }

// deleteOrder("mGuYZ52WCGE15ngsaALDgk");

async function removeReferenceAndDeleteOrder() {
  const orderId = "mGuYZ52WCGE15ngsaALDgk";

  try {
    // Remove reference from draft orderManager
    await client.patch("drafts.orderManager").unset(["order"]).commit();
    console.log("✅ Reference removed from drafts.orderManager");
  } catch (err) {
    console.error("❌ Failed to remove reference:", err);
    return;
  }

  try {
    // Delete the order document
    await client.delete(orderId);
    console.log(`✅ Order ${orderId} deleted successfully.`);
  } catch (err) {
    console.error("❌ Failed to delete order:", err);
  }
}

removeReferenceAndDeleteOrder();