import { findVideoIdByUser, updateStats, addStats } from "@/lib/db/hasura";
import { verifyToken } from "@/lib/util";
import jwt from "jsonwebtoken";

export default async function stats(req, res) {
  try {

    const token = req.cookies.token

    if (!token) {
      res.status(403).send({});
    } else {

      const inputParams = req.method === "POST" ? req.body : req.query
      const { video_id } = inputParams;

      if (video_id) {
        // const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        const user_id = await verifyToken(token)

        const findVideo = await findVideoIdByUser(
          token,
          user_id,
          video_id
        );

        const doesStatExist = findVideo?.length > 0;

        if (req.method === "POST") {
 
          const { favourited, watched = true } = req.body;

          if (doesStatExist) {
            //update
            const response = await updateStats(token, {
              favourited,
              watched,
              user_id,
              video_id,
            });
            res.send({data:response})
            res.send({ data: response });
          } else {
            // add
            const response = await addStats(token, {
              favourited,
              watched,
              user_id,
              video_id,
            });

            res.send({ data: response });
          }
        } else {
          if (doesStatExist) {
            res.send(findVideo);
          } else {
            res.status(404).send({ use: null, msg: "Video not found" });
          }

          res.send({ done: true, msg: "It's work", findVideoIdByUser });
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      done: false,
      msg: "Something went wrong, you are not a legal user",
      verify: false,
      error: error.message,
    });
  }
}
