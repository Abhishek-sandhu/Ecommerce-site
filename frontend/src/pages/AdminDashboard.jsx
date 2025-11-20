import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { fetchMyOrders } from '../slices/orderSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [''],
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMyOrders());
    fetchStats();
    fetchCategories();
  }, [dispatch]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let categoryId = newProduct.category;

      // If "add-new" is selected, create new category first
      if (newProduct.category === 'add-new') {
        if (!newCategoryName.trim()) {
          toast.error('Please enter a category name');
          return;
        }
        const categoryRes = await axios.post('/api/admin/categories', { name: newCategoryName.trim() }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        categoryId = categoryRes.data._id;
        setCategories([...categories, categoryRes.data]);
        setNewCategoryName('');
        setShowNewCategoryInput(false);
      }

      const productData = { ...newProduct, category: categoryId };

      if (isEditing) {
        // Update product
        await axios.put(`/api/admin/products/${editingProductId}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product updated successfully');
        setIsEditing(false);
        setEditingProductId(null);
      } else {
        // Create product
        await axios.post('/api/admin/products', productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product added successfully');
      }

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [''],
      });
      dispatch(fetchProducts()); // Refresh products
    } catch (error) {
      toast.error(isEditing ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id || product.category,
      stock: product.stock,
      images: product.images,
    });
    setIsEditing(true);
    setEditingProductId(product._id);
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProductId(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: [''],
    });
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#228B22' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#228B22' }}>{stats.totalOrders}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Total Products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#228B22' }}>{stats.totalProducts}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#228B22' }}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1rem' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleProductSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, category: e.target.value });
                  setShowNewCategoryInput(e.target.value === 'add-new');
                }}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
                <option value="add-new">+ Add New Category</option>
              </select>
            </div>
            {showNewCategoryInput && (
              <div className="form-group">
                <label>New Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={newProduct.images[0]}
                onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                required
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }}>{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} style={{ width: '100%', marginTop: '0.5rem', background: '#6c757d', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Manage Products</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {products.map((product) => (
              <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
                <div>
                  <h3 style={{ margin: '0', fontSize: '1.1rem' }}>{product.name}</h3>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>${product.price} - Stock: {product.stock}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{ background: '#007BFF', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{ background: '#DC3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;