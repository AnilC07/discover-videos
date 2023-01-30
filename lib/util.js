import jwt from "jsonwebtoken";


export async function verifyToken(token) {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user_id = decodedToken?.issuer;

    return user_id;
  }
  return null;
}
