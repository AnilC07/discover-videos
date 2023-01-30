import { removeTokenCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/util";
import { magicAdmin } from "@/lib/magic";

export default async function logout(req, res){

  try {
    if (!req.cookies.token) {
      return res.status(401).json({ message: "User is not logged in" });
    }
    const token = req.cookies.token;


    const user_id = await verifyToken(token);
    removeTokenCookie(res);
    try {
      await magicAdmin.users.logoutByIssuer(user_id);
    } catch (error) {
      console.log("User's session with Magic already expired");
      console.error("Error occurred while logging out magic user", error);
    } //redirects user to login page
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (error) {
    console.error({ error });
    res.status(401).json({ message: "User is not logged in" });
  }
};
