import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../util/axios";
import { toast } from "react-toastify";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const [form, setForm] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    const fetchBook = async () => {
      try {
        const res = await api.get(`/get-book/${id}`);
        const data = res.data?.data || {};
        setForm({
          url: data.url || "",
          title: data.title || "",
          author: data.author || "",
          price: data.price ?? "",
          desc: data.desc || "",
          language: data.language || "",
        });
      } catch (error) {
        console.error("Failed to load book:", error);
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "price" ? value.replace(/[^0-9.]/g, "") : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    // Basic validation
    if (!form.title.trim() || !form.author.trim() || !String(form.price).toString().trim()) {
      toast.error("Title, Author and Price are required");
      return;
    }
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Price must be a non-negative number");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        url: form.url,
        title: form.title.trim(),
        author: form.author.trim(),
        price: priceNum,
        desc: form.desc,
        language: form.language,
      };
      const res = await api.put(
        `/update-book/${id}`,
        payload
      );
      toast.success(res.data?.message || "Book updated successfully!");
      navigate(`/book/${id}`);
    } catch (error) {
      console.error("Update failed:", error);
      const msg = error.response?.data?.message || error.message || "Failed to update book";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 bg-zinc-900 min-h-[80vh]">
      <div className="max-w-3xl mx-auto bg-zinc-800 rounded-xl border border-zinc-700 p-4 sm:p-6 md:p-8 shadow-xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Edit Book</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Update the details below and save your changes.</p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Image URL</label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="The Great Book"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Price (₹)</label>
              <input
                type="text"
                name="price"
                inputMode="decimal"
                value={form.price}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="499"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Language</label>
              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="English"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              name="desc"
              rows={5}
              value={form.desc}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Write a brief description about the book..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;


