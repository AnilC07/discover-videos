import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req, ev) {
  // check the token
  const token = req ? req.cookies?.get("token")?.value : null;

  if(token){
    const user_id = await jwtVerify(
      token,
      // new TextEncoder().encode(process.env.JWT_SECRET)
      process.env.JWT_SECRET
    );

    const {pathname} = req.nextUrl.clone();

  }else{
    return NextResponse.rewrite('http://127.0.0.1:3000/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/browse/mylist",
    "/((?!api|_next/static|_next/image|static|favicon.ico).*)",
  ],
};
