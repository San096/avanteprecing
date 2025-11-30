// Importando Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyDnKgriso8lL-tBgsnMscs4cJoV0oCyUio",
  authDomain: "avante-pricing-830e7.firebaseapp.com",
  projectId: "avante-pricing-830e7",
  storageBucket: "avante-pricing-830e7.appspot.com", // ⚠️ corrigido: era .app → tem que ser .appspot.com
  messagingSenderId: "180241921540",
  appId: "1:180241921540:web:608f3e371bbd2d0cf76751"
};

// Inicializando o app
const app = initializeApp(firebaseConfig);

// Exportando os serviços para usar no React
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
