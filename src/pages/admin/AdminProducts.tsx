import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface AdminProductsProps {
  onNavigate: (section: string) => void;
}

export default function AdminProducts({ onNavigate }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    available_sizes: [] as string[],
    available_colors: [] as string[],
    is_featured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = imagePreview;

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          images: imageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id);

      if (error) {
        alert('Error updating product');
        return;
      }
    } else {
      const { error } = await supabase.from('products').insert({
        ...formData,
        images: imageUrls,
      });

      if (error) {
        alert('Error creating product');
        return;
      }
    }

    setShowModal(false);
    resetForm();
    loadData();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id || '',
      available_sizes: product.available_sizes,
      available_colors: product.available_colors,
      is_featured: product.is_featured,
    });
    setImagePreview(product.images);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('Error deleting product');
      return;
    }

    loadData();
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      available_sizes: [],
      available_colors: [],
      is_featured: false,
    });
    setImageFiles([]);
    setImagePreview([]);
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-4xl text-gray-800 tracking-wide">
              Products
            </h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Product</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-sm overflow-hidden shadow-sm"
              >
                <div className="aspect-[3/4] bg-gray-100">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg text-gray-800 mb-2 tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.price} DZD
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-sm hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-sm p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-gray-800 tracking-wide">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Price (DZD)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {imagePreview.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt=""
                            className="w-full aspect-square object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Available Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.available_sizes.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_sizes: e.target.value
                          .split(',')
                          .map((s) => s.trim()),
                      })
                    }
                    placeholder="S, M, L, XL"
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Available Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.available_colors.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_colors: e.target.value
                          .split(',')
                          .map((s) => s.trim()),
                      })
                    }
                    placeholder="Black, White, Beige"
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-600">
                    Feature on homepage
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition-all"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
