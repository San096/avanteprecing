import { FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";
import logo from "../assets/LogoI.jpeg"

export default function Header() {
  return (
    <header className="w-full bg-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Logo + Nome da empresa */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo Avante Tech Jr." className="h-10 w-10 rounded-full object-cover" />
        <h1 className="text-2xl font-extrabold text-orange-600">
          Inovale Jr.
        </h1>
      </div>
    </header>
  );
}
