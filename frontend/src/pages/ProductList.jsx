import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, categories, loading, totalPages, currentPage } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
    minPrice: '',
    maxPrice: '',
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    dispatch(fetchCategories());

    // Initialize filters from URL parameters
    const category = searchParams.get('category') || '';
    const exclude = searchParams.get('exclude') || '';
    const search = searchParams.get('search') || '';

    const initialFilters = {
      search,
      category,
      sort: '',
      minPrice: '',
      maxPrice: '',
      exclude: exclude,
    };

    setFilters(initialFilters);
    dispatch(fetchProducts(initialFilters));
  }, [dispatch, searchParams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
    setFilters({ ...filters, minPrice: min.toString(), maxPrice: max.toString() });
  };

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ ...filters, page }));
  };

  const isRelatedProductsView = searchParams.get('exclude') && searchParams.get('category');
  const categoryName = categories.find(cat => cat._id === filters.category)?.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isRelatedProductsView ? `Related Products${categoryName ? ` - ${categoryName}` : ''}` : 'Products'}
        </h1>
        {isRelatedProductsView && (
          <p className="text-gray-600 mt-2">Products similar to the one you viewed</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="px-2">
                  <div className="relative">
                    {/* Price Range Slider */}
                    <div className="relative h-2 bg-gray-200 rounded-lg">
                      <div
                        className="absolute h-2 bg-blue-600 rounded-lg"
                        style={{
                          left: `${(priceRange.min / 1000) * 100}%`,
                          right: `${100 - (priceRange.max / 1000) * 100}%`,
                        }}
                      />
                      {/* Min Handle */}
                      <div
                        className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-1 cursor-pointer border-2 border-white shadow-md"
                        style={{ left: `${(priceRange.min / 1000) * 100}%` }}
                        onMouseDown={(e) => {
                          const handleMouseMove = (e) => {
                            const rect = e.target.parentElement.getBoundingClientRect();
                            const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                            const newMin = Math.round((percent / 100) * 1000);
                            if (newMin < priceRange.max) {
                              handlePriceRangeChange(newMin, priceRange.max);
                            }
                          };
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                          });
                        }}
                      />
                      {/* Max Handle */}
                      <div
                        className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-1 cursor-pointer border-2 border-white shadow-md"
                        style={{ left: `${(priceRange.max / 1000) * 100}%` }}
                        onMouseDown={(e) => {
                          const handleMouseMove = (e) => {
                            const rect = e.target.parentElement.getBoundingClientRect();
                            const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                            const newMax = Math.round((percent / 100) * 1000);
                            if (newMax > priceRange.min) {
                              handlePriceRangeChange(priceRange.min, newMax);
                            }
                          };
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
          <div className="flex justify-center mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;