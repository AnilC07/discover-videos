import { verifyToken } from "@/lib/util";

const RedirectUser = async (context) => {
  const token = context.req ? context.req?.cookies.token : null;
  const user_id = await verifyToken(token);

  
  return {
    user_id,
    token,
  };
};

export default RedirectUser;
