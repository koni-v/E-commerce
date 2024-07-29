import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs"; // Correct import

// Component for the add/edit product
export default function ProductForm({ _id, title: existingTitle, description: existingDescription, price: existingPrice, images: existingImages }) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const data = { title, description, price, images };

  async function saveProduct(e) {
    e.preventDefault();
    if (_id) {
      // update product
      await axios.put('/api/products', { ...data, _id });
    } else {
      // create product
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push('/products');
  }

  async function uploadImages(e) {
    const files = e.target?.files;
    if (files.length > 0) {
        setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }

      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
      //console.log(res.data);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product-name"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
          {!!images?.length && images.map(link => (
            <div key={link} className="h-24">
              <img src={link} alt="" className="rounded-lg"/>
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 flex gap-1 items-center justify-center text-sm text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <div>Upload</div>
          {/* opens the file explorer */}
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <button className="btn-primary" type="submit">Save</button>
    </form>
  );
}
