import logo from "../assets/logo.png";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/95 text-slate-300 text-xs py-4 mt-10 flex flex-col items-center gap-2 border-t border-slate-800">
      <img src={logo} alt="Logo SASP-DEV" className="h-8" />

      <p className="text-center">
        Produzido por{" "}
        <span className="font-semibold text-cyan-400">SASP-DEV</span>
      </p>

      {/* Ícones sociais */}
      <div className="flex gap-4 mt-1">
        <a
          href="https://www.instagram.com/sasp_dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
        >
          <FaInstagram size={15} />
        </a>
        <a
          href="https://www.linkedin.com/in/sanderley-santos-681918211"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
        >
          <FaLinkedin size={15} />
        </a>
      </div>
    </footer>
  );
}
