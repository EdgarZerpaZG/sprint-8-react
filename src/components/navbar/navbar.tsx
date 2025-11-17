import { Link } from "react-router-dom";
import Top from './top';
import '../../App.css';
import StarWars from "../../assets/star-wars.svg";

export default function Navbar() {
  return (
    <>
      <nav className="navbar fixed w-full bg-black z-10">
        <Top />
        <div>
          <Link className="px-4 py-2 flex justify-center text-white font-bold text-xl" to="/">
            <img src={StarWars} alt="Logo" className="h-auto w-24 inline-block ml-4" />
          </Link>
        </div>
        <div className="flex justify-center items-center uppercase">
          <Link className="px-4 py-2 mx-2 text-white hover:text-gray-500" to="/">Home</Link>
          <Link className="px-4 py-2 mx-2 text-white hover:text-gray-500" to="/starships">Starships</Link>
        </div>
      </nav>
    </>
  );
}