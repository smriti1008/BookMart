import { useState } from "react";
import api from "../../util/axios";
import { toast } from "react-toastify";

const AdminAddBook = () => {
  const [form, setForm] = useState({ url: "", title: "", author: "", price: "", desc: "", language: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/add-book`, form);
      toast.success("Book added successfully!");
      setForm({ url: "", title: "", author: "", price: "", desc: "", language: "" });
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-zinc-700/50 p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-100 mb-2">Add New Book</h2>
            <p className="text-zinc-400">Fill in the details below to add a new book to the catalog</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Image URL</label>
                <input 
                  name="url" 
                  value={form.url} 
                  onChange={onChange} 
                  placeholder="https://example.com/book-cover.jpg" 
                  className="w-full bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 p-3 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 outline-none" 
                  required 
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Title</label>
                <input 
                  name="title" 
                  value={form.title} 
                  onChange={onChange} 
                  placeholder="Enter book title" 
                  className="w-full bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 p-3 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 outline-none" 
                  required 
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Author</label>
                <input 
                  name="author" 
                  value={form.author} 
                  onChange={onChange} 
                  placeholder="Author name" 
                  className="w-full bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 p-3 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 outline-none" 
                  required 
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Price ($)</label>
                <input 
                  name="price" 
                  value={form.price} 
                  onChange={onChange} 
                  placeholder="0.00" 
                  type="number" 
                  step="0.01"
                  className="w-full bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 p-3 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 outline-none" 
                  required 
                />
              </div>

              {/* Language */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-300">Language</label>
                <input 
                  name="language" 
                  value={form.language} 
                  onChange={onChange} 
                  placeholder="e.g., English, Spanish, French" 
                  className="w-full bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 p-3 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 outline-none" 
                  required 
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-300">Description</label>
                <textarea 
                  name="desc" 
                  value={form.desc} 
                  onChange={onChange} 
                  placeholder="Enter a detailed description of the book..." 
                  rows="4"
                  className="w-full bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 p-3 rounded-lg border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 outline-none resize-none" 
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={submitting} 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Book...
                </span>
              ) : (
                "Add Book"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBook;