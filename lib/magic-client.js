import { Magic } from "magic-sdk";

const createMagic = () => {
  
  // Retourne quelque chose coté client et undefined coté serveur mais ne bloque pas le programme
  return (
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  );
  //   return typeof window !== "undefined" && new Magic("pk_live_2D2E006025F13EDB");
};
export const magic = createMagic();


