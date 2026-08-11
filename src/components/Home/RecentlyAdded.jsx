import { useEffect, useState } from "react";
import api from "../../util/axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = ()=>{

  const [Data, setData] = useState();
   
  useEffect(()=>{
    const fetch = async ()=>
       {
        const response = await api.get(`/recent-books/`);
        setData(response.data.data)
       };
        fetch()
      },
      []);
  return (
    <div className="recent px-4 sm:px-6 md:px-8 py-8">
      <h4 className="text-2xl sm:text-3xl text-yellow-100">Recently added books</h4>
      {!Data && <div className="loader flex flex-col gap-4 items-center justify-center h-72 sm:h-96"><span className="text-white">Loading...</span>
        <Loader /></div>}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
        {Data && Data.map((item,i)=>(
        <div key={i}>
        <BookCard data={item}/>
        </div>
      ))}
      </div>
    </div>
  )
}

export default RecentlyAdded;