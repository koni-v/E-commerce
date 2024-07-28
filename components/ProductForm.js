import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({title: existingTitle, description: existingDescription, price: existingPrice}){
    const[title, setTitle] = useState(existingTitle || '');
    const[description, setDescription] = useState(existingDescription || '');
    const[price, setPrice] = useState(existingPrice || '');
    const[goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function createProduct(e){
        e.preventDefault();
        const data = {title, description, price};
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }

    if(goToProducts){
        router.push('/products');
    }

    return(
        <form onSubmit={createProduct}>
            <label>Product Name</label>
            <input type="text" 
                placeholder="product-name" 
                value={title} 
                onChange={e => setTitle(e.target.value)}/>
            <label>Description</label>
            <textarea placeholder="description" 
                    value={description} 
                    onChange={e => 
                    setDescription(e.target.value)}></textarea>
            <label>Price (in USD)</label>
            <input type="number" 
                placeholder="price" 
                value={price} 
                onChange={e => setPrice(e.target.value)}></input>
            <button class="btn-primary"
                    type="submit">Save</button>
        </form>
    )
}