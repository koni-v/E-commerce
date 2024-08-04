import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function Categories(){

    const [name, setName] = useState(); // name of category
    const [parentCategory, setParentCategory] = useState(''); // select parent
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(e) {
        e.preventDefault();
        const data = {name, parentCategory}
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory("");
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory 
            ? `Edit category ${editedCategory.name}` 
            : 'Create new category'}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" 
                       type="text" 
                       placeholder={'Category name'} 
                       onChange={e => setName(e.target.value)}
                       value={name}/>
                <select className="mb-0" 
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}>
                    <option value={0}>No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button className="btn-primary mr-1" 
                                        onClick={() => editCategory(category)}>Edit</button>
                                <button className="btn-primary">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}