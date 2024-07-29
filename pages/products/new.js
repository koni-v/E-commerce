import Layout from "../../components/Layout";
import ProductForm from "../../components/ProductForm";

// Add product page
export default function NewProduct(){
    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm />
        </Layout>
    )
}  