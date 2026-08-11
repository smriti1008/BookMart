import React, { useState } from "react";
import { useEffect } from "react";
import api from "../../util/axios";
import BookCard from "../BookCard/BookCard";
import { toast } from "react-toastify";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    // Fetch favourite books logic here
    const fetchFavourites = async () => {
      try {
        const response = await api.get(
          `/favourites`
        );
        setFavourites(response.data.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    fetchFavourites();
  }, []);

  // ✅ remove from favourites and update UI
  const handleRemove = async (bookId) => {
    try {
      const response = await api.put(
        `/remove-from-favourite`,
        { bookId }
      );

      toast.success(response.data.message || "Removed from favourites!");

      // ✅ remove book from local state (UI updates instantly)
      setFavourites((prev) => prev.filter((item) => item._id !== bookId));
    } catch (error) {
      console.error("Error removing from favourites:", error);
      toast.error("Failed to remove from favourites");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {favourites.length === 0 && (
        <p className="text-zinc-500 text-center  lg:text-5xl col-span-full">
          No favourite books found.
        </p>
      )}
      {favourites &&
        favourites.map((items, i) => (
          <div key={i}>
            
            <BookCard
              key={items._id}
              data={items}
              favourites={true}
              onRemove={handleRemove} // ✅ pass callback
            />
          </div>
        ))}
    </div>
  );
};

export default Favourites;
