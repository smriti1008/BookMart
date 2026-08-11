import img from "./hero.png"; 
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div className="hero min-h-[80vh] md:h-[75vh] px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-center items-center gap-8 sm:gap-10 md:gap-12">
      <div className="mt-8 sm:mt-10 w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
        <h1  className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Discover Your New Great Read
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-300 text-center lg:text-left">
          Uncover captivating stories, enriching knowledge, and endless
          inspiration in our curated collection of books...
        </p>
        <div className="mt-8">
          <Link to={'/all-books'} className="text-yellow-100 text-lg sm:text-xl lg:text-2xl font-semibold border border-yellow-100 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 hover:bg-zinc-800 rounded-full">
            Discover book
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
      <img src={img} alt="hero"  className = "w-10/12 sm:w-3/4 md:w-2/3 lg:w-auto max-h-[45vh] sm:max-h-[50vh] md:max-h-[60vh] object-contain"/>
      </div>
    </div>
  );
};

export default Hero;
