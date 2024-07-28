import Link from "next/link";
import Layout from "../components/Layout";

export default function Products() {
  return(
    <Layout>
        <Link className="bg-gray-300 rounded-md text-white py-1 px-2" href={'/products/new'}>Add new product</Link>
    </Layout>
  )
}