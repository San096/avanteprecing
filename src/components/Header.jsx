import { FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";
import logo from "../assets/avantelogo.png"; // coloque aqui o caminho da sua logo

export default function Header() {
  return (
    <header className="w-full bg-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Logo + Nome da empresa */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo Avante Tech Jr." className="h-10 w-10 rounded-full object-cover" />
        <h1 className="text-2xl font-extrabold text-blue-700">
          Avante Tech Jr.
        </h1>
      </div>

      {/* Ícones sociais */}
      <div className="flex gap-5 text-gray-700">
        <a
          href="https://www.avantetechjr.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          <FaGlobe size={22} />
        </a>

        <a
          href="https://www.instagram.com/avantetechjr/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          <FaInstagram size={22} />
        </a>

        <a
          href="https://www.linkedin.com/company/avantetechjr/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          <FaLinkedin size={22} />
        </a>
      </div>
    </header>
  );
}
