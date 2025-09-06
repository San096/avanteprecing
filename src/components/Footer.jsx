
import logo from "../assets/logo.png"
import { FaInstagram, FaLinkedin } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="w-full bg-blue-text-center text-xs py-3 mt-10 flex flex-col items-center gap-2">
      <img src={logo} alt="Logo ÁSAP-DEV" className="h-8" />
      <p>
        Produzido por <span className="font-semibold">SASP-DEV</span>
      </p>

      {/* Ícones sociais */}
      <div className="flex gap-4 mt-2">
        <a
          href="https://www.instagram.com/sasp_dev/#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
        >
          <FaInstagram size={15} />
        </a>
        <a
          href="www.linkedin.com/in/sanderley-santos-681918211"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
        >
          <FaLinkedin size={15} />
        </a>
      </div>
    </footer>
  );
}