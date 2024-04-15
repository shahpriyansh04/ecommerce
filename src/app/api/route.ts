import { revalidatePath } from "next/cache";

export const GET = async () => {
  await revalidatePath("/", "layout");
  console.log("GET /api/products");

  return Response.json({
    message: "GET /api/products",
  });
};
