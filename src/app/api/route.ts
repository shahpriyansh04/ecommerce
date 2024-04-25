import { revalidatePath } from "next/cache";

export const GET = async () => {
  await revalidatePath("/", "layout");

  return Response.json({
    message: "GET /api/products",
  });
};
