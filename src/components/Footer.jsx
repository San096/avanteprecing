
import logo from "../assets/avantelogo.png"
import { FaInstagram, FaLinkedin } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="w-full bg-blue-text-center text-xs py-3 mt-10 flex flex-col items-center gap-2">
      <img src={logo} alt="Logo ÁSAP-DEV" className="h-8" />
      <p>
        Produzido por <span className="font-semibold">AvanteTechJr</span>
      </p>

      {/* Ícones sociais */}
      <div className="flex gap-4 mt-2">
        <a
          href="https://www.instagram.com/avantetechjr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
        >
          <FaInstagram size={15} />
        </a>
        <a
          href="https://www.linkedin.com/company/avante-tech-jr/posts/?feedView=all"
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