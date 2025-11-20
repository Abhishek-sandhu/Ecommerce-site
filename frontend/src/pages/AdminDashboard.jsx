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
    recentOrders: [],
    orderStatusStats: [],
    monthlyRevenue: [],
    lowStockProducts: [],
    todaysOrders: 0,
    todaysRevenue: 0,
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
      fetchStats(); // Refresh stats
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

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product deleted successfully');
      dispatch(fetchProducts()); // Refresh products
      fetchStats(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem', color: '#333', fontSize: '2.5rem', fontWeight: 'bold' }}>Admin Dashboard</h1>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>Total Users</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>Total Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats.totalOrders}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>Total Products</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>{stats.totalProducts}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: 'white' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>Total Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Today's Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderLeft: '4px solid #ff6b6b' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Today's Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#ff6b6b' }}>{stats.todaysOrders}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderLeft: '4px solid #4ecdc4' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Today's Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#4ecdc4' }}>${stats.todaysRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>

        {/* Recent Orders */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>Recent Orders</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  background: '#fafafa'
                }}>
                  <div>
                    <p style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>
                      Order #{order._id.slice(-8)}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      {order.user?.name || 'Unknown User'} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontWeight: 'bold', color: '#228B22' }}>
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor:
                        order.status === 'delivered' ? '#d4edda' :
                        order.status === 'shipped' ? '#cce5ff' :
                        order.status === 'confirmed' ? '#fff3cd' :
                        order.status === 'pending' ? '#f8d7da' : '#e2e3e5',
                      color:
                        order.status === 'delivered' ? '#155724' :
                        order.status === 'shipped' ? '#004085' :
                        order.status === 'confirmed' ? '#856404' :
                        order.status === 'pending' ? '#721c24' : '#383d41'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No orders yet</p>
            )}
          </div>
        </div>

        {/* Order Status & Low Stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Order Status Breakdown */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Order Status</h3>
            {stats.orderStatusStats.map((status) => (
              <div key={status._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ textTransform: 'capitalize' }}>{status._id}</span>
                <span style={{ fontWeight: 'bold' }}>{status.count}</span>
              </div>
            ))}
          </div>

          {/* Low Stock Alert */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>⚠️ Low Stock Alert</h3>
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div key={product._id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#fff5f5', borderRadius: '4px' }}>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#d63031' }}>{product.name}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Only {product.stock} left • ${product.price}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem' }}>All products are well stocked! 🎉</p>
            )}
          </div>
        </div>
      </div>

      {/* Product Management Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
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

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
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