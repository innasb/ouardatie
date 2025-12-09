import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, X, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface StockVariant {
  color: string;
  colorHex: string;
  size: string;
  quantity: number;
}

interface AdminProductsProps {
  onNavigate: (section: string) => void;
}

export default function AdminProducts({ onNavigate }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentColorName, setCurrentColorName] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  
  // Stock variant management
  const [stockVariants, setStockVariants] = useState<StockVariant[]>([]);
  const [variantColor, setVariantColor] = useState('');
  const [variantSize, setVariantSize] = useState('');
  const [variantQuantity, setVariantQuantity] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailed_description: '',
    price: 0,
    category_id: '',
    available_sizes: [] as string[],
    available_colors: [] as { hex: string; name: string }[],
    fabric_composition: '',
    care_instructions: '',
    stock_quantity: 0,
    is_featured: false,
    is_on_promotion: false,
    promotion_price: 0,
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

  const addColor = () => {
    if (currentColor && currentColorName.trim()) {
      const colorExists = formData.available_colors.some(
        c => c.hex === currentColor || c.name.toLowerCase() === currentColorName.toLowerCase()
      );
      if (!colorExists) {
        setFormData({
          ...formData,
          available_colors: [...formData.available_colors, { hex: currentColor, name: currentColorName.trim() }],
        });
        setCurrentColorName('');
      }
    }
  };

  const removeColor = (index: number) => {
    const removedColor = formData.available_colors[index];
    setFormData({
      ...formData,
      available_colors: formData.available_colors.filter((_, i) => i !== index),
    });
    // Remove all stock variants with this color
    setStockVariants(prev => prev.filter(v => v.color !== removedColor.name));
  };

  const addStockVariant = () => {
    if (variantColor && variantSize && variantQuantity >= 0) {
      const exists = stockVariants.some(
        v => v.color === variantColor && v.size === variantSize
      );
      
      if (exists) {
        // Update existing variant
        setStockVariants(prev =>
          prev.map(v =>
            v.color === variantColor && v.size === variantSize
              ? { ...v, quantity: variantQuantity }
              : v
          )
        );
      } else {
        // Add new variant
        const colorObj = formData.available_colors.find(c => c.name === variantColor);
        setStockVariants(prev => [
          ...prev,
          {
            color: variantColor,
            colorHex: colorObj?.hex || '#000000',
            size: variantSize,
            quantity: variantQuantity,
          },
        ]);
      }
      
      setVariantSize('');
      setVariantQuantity(0);
    }
  };

  const removeStockVariant = (color: string, size: string) => {
    setStockVariants(prev =>
      prev.filter(v => !(v.color === color && v.size === size))
    );
  };

  const calculateTotalStock = () => {
    return stockVariants.reduce((sum, v) => sum + v.quantity, 0);
  };

  const calculateStockStatus = (quantity: number | null): string => {
    if (quantity === null || quantity === 0) return 'out_of_stock';
    if (quantity < 10) return 'low_stock';
    return 'available';
  };

  const getStockByColor = (variants: StockVariant[]) => {
    const byColor: { [key: string]: { total: number; hex: string; sizes: { [key: string]: number } } } = {};
    
    variants.forEach(v => {
      if (!byColor[v.color]) {
        byColor[v.color] = { total: 0, hex: v.colorHex, sizes: {} };
      }
      byColor[v.color].total += v.quantity;
      byColor[v.color].sizes[v.size] = v.quantity;
    });
    
    return byColor;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = imagePreview.length > 0 ? imagePreview : null;
    const totalStock = calculateTotalStock();
    const stockStatus = calculateStockStatus(totalStock);
    
    const colorStrings = formData.available_colors.length > 0 
      ? formData.available_colors.map(c => JSON.stringify(c))
      : null;

    // Convert stock variants to string array for database
    const variantStrings = stockVariants.length > 0
      ? stockVariants.map(v => JSON.stringify(v))
      : null;

    const productData = {
      name: formData.name,
      description: formData.description,
      detailed_description: formData.detailed_description || null,
      price: formData.price,
      category_id: formData.category_id || null,
      images: imageUrls,
      available_sizes: formData.available_sizes.length > 0 ? formData.available_sizes : null,
      available_colors: colorStrings,
      fabric_composition: formData.fabric_composition || null,
      care_instructions: formData.care_instructions || null,
      stock_quantity: totalStock,
      stock_status: stockStatus,
      stock_variants: variantStrings,
      is_featured: formData.is_featured,
      is_on_promotion: formData.is_on_promotion,
      promotion_price: formData.is_on_promotion ? formData.promotion_price : null,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq('id', editingProduct.id);

      if (error) {
        alert('Error updating product: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('products').insert(productData);

      if (error) {
        alert('Error creating product: ' + error.message);
        return;
      }
    }

    setShowModal(false);
    resetForm();
    loadData();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    let parsedColors: { hex: string; name: string }[] = [];
    if (product.available_colors && Array.isArray(product.available_colors)) {
      parsedColors = product.available_colors.map(colorStr => {
        try {
          const parsed = JSON.parse(colorStr);
          if (parsed.hex && parsed.name) {
            return parsed;
          }
        } catch (e) {
          // Fallback
        }
        return { hex: colorStr, name: colorStr };
      });
    }

    // Parse stock variants
    let parsedVariants: StockVariant[] = [];
    if (product.stock_variants && Array.isArray(product.stock_variants)) {
      parsedVariants = product.stock_variants.map(variantStr => {
        try {
          return JSON.parse(variantStr);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
    }
    
    setFormData({
      name: product.name,
      description: product.description,
      detailed_description: product.detailed_description || '',
      price: product.price,
      category_id: product.category_id || '',
      available_sizes: product.available_sizes || [],
      available_colors: parsedColors,
      fabric_composition: product.fabric_composition || '',
      care_instructions: product.care_instructions || '',
      stock_quantity: product.stock_quantity || 0,
      is_featured: product.is_featured || false,
      is_on_promotion: product.is_on_promotion || false,
      promotion_price: product.promotion_price || 0,
    });
    setStockVariants(parsedVariants);
    setImagePreview(product.images || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('Error deleting product: ' + error.message);
      return;
    }

    loadData();
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      detailed_description: '',
      price: 0,
      category_id: '',
      available_sizes: [],
      available_colors: [],
      fabric_composition: '',
      care_instructions: '',
      stock_quantity: 0,
      is_featured: false,
      is_on_promotion: false,
      promotion_price: 0,
    });
    setImageFiles([]);
    setImagePreview([]);
    setCurrentColor('#000000');
    setCurrentColorName('');
    setStockVariants([]);
    setVariantColor('');
    setVariantSize('');
    setVariantQuantity(0);
    setSizeInput('');
  };

  const getStockDisplay = (product: Product) => {
    const quantity = product.stock_quantity || 0;
    const statusValue = product.stock_status || calculateStockStatus(quantity);
    
    if (statusValue === 'out_of_stock') {
      return (
        <div className="mb-3">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">Rupture de stock</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (statusValue === 'low_stock') {
      return (
        <div className="mb-3">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2.5 rounded">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-medium text-yellow-800">Stock faible: {quantity} unités</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <p className="text-sm text-green-600 font-medium mb-3">
        ✓ En stock: {quantity} unités
      </p>
    );
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
            {products.map((product) => {
              const variants = product.stock_variants 
                ? product.stock_variants.map(v => {
                    try {
                      return JSON.parse(v);
                    } catch {
                      return null;
                    }
                  }).filter(Boolean)
                : [];
              const stockByColor = getStockByColor(variants);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/4] bg-gray-100 relative">
                    {product.images && product.images[0] ? (
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
                    
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {product.is_on_promotion && product.promotion_price && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-lg">
                          -{Math.round(((product.price - product.promotion_price) / product.price) * 100)}% OFF
                        </span>
                      )}
                      
                      {product.stock_status === 'out_of_stock' && (
                        <span className="px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded shadow-lg">
                          RUPTURE
                        </span>
                      )}
                      {product.stock_status === 'low_stock' && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded shadow-lg">
                          STOCK BAS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-lg text-gray-800 tracking-wide">
                        {product.name}
                      </h3>
                    </div>
                    
                    {product.is_on_promotion && product.promotion_price ? (
                      <div className="mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-red-600 text-base font-bold">
                            {product.promotion_price} DZD
                          </span>
                          <span className="text-gray-400 text-sm line-through">
                            {product.price} DZD
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm mb-1">
                        {product.price} DZD
                      </p>
                    )}
                    
                    {getStockDisplay(product)}

                    {/* Stock Variants Display */}
                    {Object.keys(stockByColor).length > 0 && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">Stock par variante:</span>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(stockByColor).map(([color, data]) => (
                            <div key={color} className="flex items-start gap-2 text-xs">
                              <div
                                className="w-4 h-4 rounded border border-gray-300 flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: data.hex }}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-700">{color}: {data.total} unités</div>
                                <div className="text-gray-500 text-xs">
                                  {Object.entries(data.sizes).map(([size, qty]) => `${size}: ${qty}`).join(', ')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
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
              );
            })}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-sm p-8 max-w-4xl w-full my-8">
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

              <div className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Nom de la pièce *
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
                    Description courte *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Description détaillée
                  </label>
                  <textarea
                    value={formData.detailed_description}
                    onChange={(e) =>
                      setFormData({ ...formData, detailed_description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Prix (DZD) *
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

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="promotion"
                      checked={formData.is_on_promotion}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          is_on_promotion: e.target.checked,
                          promotion_price: e.target.checked ? formData.promotion_price : 0,
                        });
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="promotion" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">PROMO</span>
                      Mettre ce produit en promotion
                    </label>
                  </div>
                  
                  {formData.is_on_promotion && (
                    <div className="mt-3 pl-8">
                      <label className="block text-sm text-gray-600 mb-2">
                        Prix promotionnel (DZD) *
                      </label>
                      <input
                        type="number"
                        required={formData.is_on_promotion}
                        value={formData.promotion_price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promotion_price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-400"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Photos HD
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
                    Tailles disponibles *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === ',') {
                          e.preventDefault();
                          const newSize = sizeInput.trim().toUpperCase();
                          if (newSize && !formData.available_sizes.includes(newSize)) {
                            setFormData({
                              ...formData,
                              available_sizes: [...formData.available_sizes, newSize],
                            });
                          }
                          setSizeInput('');
                        }
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newSize = sizeInput.trim().toUpperCase();
                          if (newSize && !formData.available_sizes.includes(newSize)) {
                            setFormData({
                              ...formData,
                              available_sizes: [...formData.available_sizes, newSize],
                            });
                          }
                          setSizeInput('');
                        }
                      }}
                      onBlur={() => {
                        const newSize = sizeInput.trim();
                        if (newSize && !formData.available_sizes.includes(newSize)) {
                          setFormData({
                            ...formData,
                            available_sizes: [...formData.available_sizes, newSize],
                          });
                        }
                        setSizeInput('');}}
                      placeholder="Tapez une taille et appuyez sur espace ou virgule"
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                    />
                    {formData.available_sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {formData.available_sizes.map((size, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  available_sizes: formData.available_sizes.filter((_, i) => i !== idx),
                                });
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-3">
                    Couleurs disponibles *
                  </label>
                  
                  {formData.available_colors.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-wrap gap-3">
                        {formData.available_colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="group relative flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div
                              className="w-10 h-10 rounded-lg border-2 border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-800">{color.name}</span>
                              <span className="text-xs text-gray-500 font-mono">{color.hex}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeColor(idx)}
                              className="ml-2 p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Ajouter une couleur</p>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-500">Couleur</label>
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-xs text-gray-500">Nom de la couleur *</label>
                          <input
                            type="text"
                            value={currentColorName}
                            onChange={(e) => setCurrentColorName(e.target.value)}
                            placeholder="Ex: Rouge, Noir, Beige..."
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addColor();
                              }
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addColor}
                          disabled={!currentColorName.trim()}
                          className="self-end px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STOCK VARIANTS SECTION */}
                <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Gestion du Stock par Variante</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Définissez la quantité exacte en stock pour chaque combinaison de couleur et taille
                  </p>

                  {/* Current Stock Variants */}
                  {stockVariants.length > 0 && (
                    <div className="mb-6 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Stock actuel:</h4>
                      {Object.entries(getStockByColor(stockVariants)).map(([color, data]) => (
                        <div key={color} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-8 h-8 rounded-lg border-2 border-gray-300"
                              style={{ backgroundColor: data.hex }}
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{color}</div>
                              <div className="text-sm text-gray-500">Total: {data.total} unités</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-11">
                            {Object.entries(data.sizes).map(([size, qty]) => (
                              <div key={size} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">{size}:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900">{qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeStockVariant(color, size)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-700" />
                          <span className="text-sm font-bold text-blue-900">
                            Stock total: {calculateTotalStock()} unités
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Stock Variant Form */}
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                      Ajouter une variante de stock
                    </p>
                    
                    {formData.available_colors.length === 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3 mb-3">
                        ⚠️ Veuillez d'abord ajouter des couleurs disponibles ci-dessus
                      </div>
                    )}
                    
                    {formData.available_sizes.length === 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3 mb-3">
                        ⚠️ Veuillez d'abord ajouter des tailles disponibles ci-dessus
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Couleur *</label>
                        <select
                          value={variantColor}
                          onChange={(e) => setVariantColor(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
                          disabled={formData.available_colors.length === 0}
                        >
                          <option value="">Choisir...</option>
                          {formData.available_colors.map((color) => (
                            <option key={color.name} value={color.name}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Taille *</label>
                        <select
                          value={variantSize}
                          onChange={(e) => setVariantSize(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
                          disabled={formData.available_sizes.length === 0}
                        >
                          <option value="">Choisir...</option>
                          {formData.available_sizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Quantité *</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            value={variantQuantity}
                            onChange={(e) => setVariantQuantity(parseInt(e.target.value) || 0)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
                            placeholder="0"
                          />
                          <button
                            type="button"
                            onClick={addStockVariant}
                            disabled={!variantColor || !variantSize}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-3">
                      💡 Conseil: Ajoutez toutes les combinaisons de couleur/taille que vous avez en stock
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Tissu et composition
                  </label>
                  <textarea
                    value={formData.fabric_composition}
                    onChange={(e) =>
                      setFormData({ ...formData, fabric_composition: e.target.value })
                    }
                    rows={2}
                    placeholder="Ex: 100% Coton, Mélange Lin/Coton 60/40"
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Conseils d'entretien
                  </label>
                  <textarea
                    value={formData.care_instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, care_instructions: e.target.value })
                    }
                    rows={3}
                    placeholder="Ex: Lavage en machine à 30°C, Ne pas blanchir"
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
                    Mettre en avant sur la page d'accueil
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-100 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition-all"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}