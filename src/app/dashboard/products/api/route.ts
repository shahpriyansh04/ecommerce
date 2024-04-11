import { revalidatePath } from "next/cache";

export const GET = () => {
  revalidatePath("/dashboard/products");
  return Response.json({
    message: "GET /api/products",
  });
};
