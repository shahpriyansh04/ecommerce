"use server";

import { revalidatePath } from "next/cache";

export default async function revalidateUserPath() {
  await revalidatePath("/dashboard/products");
}
