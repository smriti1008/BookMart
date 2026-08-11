import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import { useEffect, useState } from "react";
import api from "../util/axios";

const AllBooks =()=>{
  const [Data, setData] = useState();

  useEffect(()=>{
    const fetch = async ()=>
       {
        const response = await api.get(`/get-all-books`);
        setData(response.data.data)
       };
        fetch()
      },
      []);
  return(
    <div className="allbooks bg-zinc-900 h-auto px-4 sm:px-8 md:px-12 py-6 md:py-8">
      <h4 className="text-2xl sm:text-3xl text-yellow-100">All books</h4>
      {!Data && <div className="loader flex flex-col gap-2 items-center justify-center h-72 sm:h-96"><span className="text-white text-sm sm:text-base">Loading...</span>
        <Loader /></div>}
      <div className="my-6 md:my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 ">
        {Data && Data.map((item,i)=>(
        <div key={i}>
        <BookCard data={item}/>
        </div>
      ))}
      </div>
    </div>
  )
}

export default AllBooks;