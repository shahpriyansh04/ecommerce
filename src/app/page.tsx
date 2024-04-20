import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "./_components/Navbar";
import { client } from "@/lib/convex-client";
import ProductCard from "./_components/ProductCard";
import revalidateUserPath from "./dashboard/products/action";

export default async function Home() {
  revalidateUserPath();
  const products = await client.query(api.products.getProducts, {});
  console.log(products);

  return (
    <div className="">
      <div className="px-16 py-4">
        <Navbar />
      </div>{" "}
      <hr />
      <div className="px-16 py-12 grid grid-cols-4 gap-12">
        {products.map((product) => {
          return <ProductCard {...product} key={product._id} />;
        })}
      </div>
    </div>
  );
}
