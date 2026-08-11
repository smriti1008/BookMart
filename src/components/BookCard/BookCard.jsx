import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import api from '../../util/axios';
import { toast } from 'react-toastify';

const BookCard = ({ data, favourites, onRemove, showAddToCart = false, showRemoveFromCart = false, onRemoveFromCart }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation to book details
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.warning('Please login to add items to cart');
      return;
    }

    if (!data._id) {
      toast.error('Invalid book data');
      return;
    }

    try {
      const response = await api.post(
        `/cart`,
        { bookId: data._id }
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

   return (
    <>
      <Link to={`/book/${data._id}`}>
        <div className="bg-zinc-800 rounded p-3 sm:p-4 flex flex-col">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url || "https://via.placeholder.com/150"} alt='/' className='w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-48 object-cover' />
          </div>
          <h4 className="text-zinc-200 font-semibold text-base sm:text-lg md:text-xl mt-2 line-clamp-2">{data.title}</h4>
          <p className='mt-1 sm:mt-2 text-zinc-400 font-semibold text-sm sm:text-base'> by {data.author}</p>
          <p className='mt-1 sm:mt-2 text-zinc-200 font-semibold text-base sm:text-lg'>₹ {data.price}</p>
          </div>
      </Link>
      
      {showAddToCart && isLoggedIn && (
        <button 
          className='mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base' 
          onClick={handleAddToCart}
        >
          <FaShoppingCart className='text-sm sm:text-base' />
          Add to Cart
        </button>
      )}
      
      {
        favourites && (
          <button className='mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base'  onClick={() => onRemove(data._id)}>
            Remove from Favourites
          </button>
        )}
      
      {
        showRemoveFromCart && isLoggedIn && (
          <button 
            className='mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base' 
            onClick={() => onRemoveFromCart && onRemoveFromCart(data._id)}
          >
            Remove from Cart
          </button>
        )}
      
    </>
  );
};

export default BookCard;
