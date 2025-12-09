import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type ShippingOption = Database['public']['Tables']['shipping_options']['Row'];

interface AdminShippingProps {
  onNavigate: (section: string) => void;
}

export default function AdminShipping({ onNavigate }: AdminShippingProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState<ShippingOption | null>(null);

  const [formData, setFormData] = useState({
    wilaya: '',
    desk_price: 0,
    home_price: 0
  });

  useEffect(() => {
    loadShippingOptions();
  }, []);

  const loadShippingOptions = async () => {
    const { data } = await supabase
      .from('shipping_options')
      .select('*')
      .order('wilaya');

    if (data) setShippingOptions(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOption) {
      const { error } = await supabase
        .from('shipping_options')
        .update(formData)
        .eq('id', editingOption.id);

      if (error) {
        alert('Error updating shipping option');
        return;
      }
    } else {
      const { error } = await supabase
        .from('shipping_options')
        .insert(formData);

      if (error) {
        alert('Error creating shipping option');
        return;
      }
    }

    setShowModal(false);
    resetForm();
    loadShippingOptions();
  };

  const handleEdit = (option: ShippingOption) => {
    setEditingOption(option);
    setFormData({
      wilaya: option.wilaya,
      desk_price: option.desk_price,
      home_price: option.home_price
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping option?')) return;

    const { error } = await supabase
      .from('shipping_options')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting shipping option');
      return;
    }

    loadShippingOptions();
  };

  const resetForm = () => {
    setEditingOption(null);
    setFormData({
      wilaya: '',
      desk_price: 0,
      home_price: 0
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-4xl text-gray-800 tracking-wide">
              Shipping Options
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
            <span className="text-sm">Add Shipping Option</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Wilaya
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Desk Delivery
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Home Delivery
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shippingOptions.map(option => (
                  <tr key={option.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {option.wilaya}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {option.desk_price} DZD
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {option.home_price} DZD
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(option)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(option.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-sm p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-gray-800 tracking-wide">
                  {editingOption ? 'Edit Shipping Option' : 'Add Shipping Option'}
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
                  <label className="block text-sm text-gray-600 mb-2">Wilaya</label>
                  <input
                    type="text"
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                    placeholder="Alger"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Desk Delivery Price (DZD)</label>
                  <input
                    type="number"
                    required
                    value={formData.desk_price}
                    onChange={(e) => setFormData({ ...formData, desk_price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Home Delivery Price (DZD)</label>
                  <input
                    type="number"
                    required
                    value={formData.home_price}
                    onChange={(e) => setFormData({ ...formData, home_price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                  />
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
                    {editingOption ? 'Update' : 'Create'}
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
