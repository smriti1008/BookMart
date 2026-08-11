import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../util/axios";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaRegHeart, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ViewBookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  
  
  const handleFavoriteClick = async() => {
    try {
      const response = await api.put(`/added-in-favourite`, { bookId: id });
      toast.success(response.data.message || "Added to favourites!");
    } catch (error) {
      console.error("Error adding to favourites:", error);
      toast.error(error.response?.data?.message || "Failed to add to favourites");
    }
  };



  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.warning('Please login to add items to cart');
      return;
    }

    if (!id || !Data) {
      toast.error('Invalid book data');
      return;
    }

    try {
      const response = await api.post(
        `/cart`,
        { bookId: id }
      );
      toast.success(response.data.message || "Book added to cart!");
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error("Add to cart error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

   const handleEditBook = () => {
    // Navigate to edit page or open edit modal
    navigate(`/edit-book/${id}`);
  };

  

    const handleDeleteBook = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
      try {
        await api.delete(`/delete-book/${id}`);
        toast.success("Book deleted successfully!");
        navigate('/all-books'); // Navigate to books list after deletion
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Failed to delete book");
      }
    }
  };



  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await api.get(
          `/get-book/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  } // show loader while fetching
  if (!Data) return <p className="text-red-500">Book not found</p>; // safe guard

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 bg-zinc-900 flex flex-col md:flex-row gap-6 md:gap-8 rounded">
      <div className="bg-zinc-800 rounded p-3 md:p-6 lg:p-8 h-[45vh] md:h-[60vh] lg:h-[88vh] w-full lg:w-3/6 flex items-center justify-center relative ">
        {Data.url ? (
          <img
            src={Data.url}
            alt={Data.title || "Book"}
            className="h-[35vh] md:h-[45vh] lg:h-[70vh] object-contain"
          />
        ) : (
          <p className="text-gray-400">No image available</p>
        )}

           {/* Icon buttons positioned to the right of the image */}
        {isLoggedIn && role === 'user' && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 md:gap-3 lg:gap-4 md:top-4 lg:top-6 md:right-4 lg:right-6">
          <button
            onClick={handleFavoriteClick}
            className="bg-zinc-700 p-2.5 sm:p-3 rounded-full hover:bg-zinc-600 transition-colors duration-200 group"
            title="Add to favorites"
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-lg sm:text-xl" />
            ) : (
              <FaRegHeart className="text-zinc-300 text-lg sm:text-xl group-hover:text-red-500 transition-colors" />
            )}
          </button>
          
          <button
            onClick={handleAddToCart}
            className="bg-zinc-700 p-2.5 sm:p-3 rounded-full hover:bg-zinc-600 transition-colors duration-200 group"
            title="Add to cart"
          >
            <FaShoppingCart className="text-zinc-300 text-lg sm:text-xl group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      )}

      {/* Admin action buttons */}
        {isLoggedIn && role === 'admin' && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 md:gap-3 lg:gap-4 md:top-4 lg:top-6 md:right-4 lg:right-6">
            <button
              onClick={handleEditBook}
              className="bg-zinc-700 p-2.5 sm:p-3 rounded-full hover:bg-zinc-600 transition-colors duration-200 group"
              title="Edit book"
            >
              <FaEdit className="text-zinc-300 text-lg sm:text-xl group-hover:text-green-400 transition-colors" />
            </button>
            
            <button
              onClick={handleDeleteBook}
              className="bg-zinc-700 p-2.5 sm:p-3 rounded-full hover:bg-zinc-600 transition-colors duration-200 group"
              title="Delete book"
            >
              <FaTrash className="text-zinc-300 text-lg sm:text-xl group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        )}
      </div>
      <div className="p-3 md:p-4 w-full lg:w-3/6">
        <h2 className="text-xl sm:text-2xl text-zinc-300">
          {Data.title || "Untitled Book"}
        </h2>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          by {Data.author || "Unknown Author"}
        </p>
        <p className="text-gray-500 mt-4 text-base sm:text-lg md:text-xl">
          {Data.desc || "No description available."}
        </p>
        <p className="flex items-center justify-start text-gray-400 text-sm sm:text-base">
          <GrLanguage className="mr-2 sm:mr-3 text-base sm:text-lg" /> {Data.language || "Unknown language"}
        </p>
        <p className="mt-4 text-zinc-100 text-2xl sm:text-3xl font-semibold">
          Price: ₹ {Data.price ?? "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ViewBookDetails;
