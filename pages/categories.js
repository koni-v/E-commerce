import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}){

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
        const data = {name, parentCategory: parentCategory || null}
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
        setParentCategory(category.parent?._id || '');
    }

    function deleteCategor(category){
        swal.fire({
            title: "Are you sure?",
            text: ` Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
            didOpen: () => {
                // run when swal is opened...
            },
            didClose: () => {
                // run when swal is closed...
            }
        }).then(async result => {
            // when confirmed and promise resolved...
            if (result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        })
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
                        onChange={e => setParentCategory(e.target.value)}
                        value={parentCategory}>
                    <option value="">No parent category</option>
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
                            <td>{category?.parent?.name || ''}</td>
                            <td>
                                <button className="btn-primary mr-1" 
                                        onClick={() => editCategory(category)}>Edit</button>
                                <button className="btn-primary"
                                        onClick={() => deleteCategor(category)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal (({swal}, ref) => (
    <Categories swal = {swal} />
));