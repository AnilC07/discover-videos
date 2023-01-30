import videoTestData from "../data/videos.json";
import { getWatchedVideos } from "./db/hasura";
import { getMyListVideos } from "@/lib/db/hasura";

const fetchVideos = async (URL) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const response = await fetch(
    `https://${BASE_URL}/${URL}&key=${YOUTUBE_API_KEY}`
  );

  return await response.json();
};

export const getCommonVideos = async (URL) => {
  try {
    const isDev = process.env.DEVELOPMENT;

    const datas = isDev ? videoTestData : await fetchVideos(URL);
    const BASE_URL = "youtube.googleapis.com/youtube/v3";

    const response = await fetch(
      `https://${BASE_URL}/${URL}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.log("Youtube API error:", data.error);
      return [];
    }

    return data?.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        title: snippet.title,
        id,
        imgUrl: `http://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        description: snippet.description,
        publishedTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.log("Something went wrong with video library", error);
    return [];
  }
};

export const getVideos = (query) => {
  const URL = `search?part=snippet&maxResults=25&q=${query}&type=video`;

  //   const URL = `search?part=snippet&maxResults=30&q=marvel&type=video&`;
  return getCommonVideos(URL);
};

export const getPopularVideos = (query) => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=TR";

  //videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (user_id,token) => {

  const videos = await getWatchedVideos(user_id, token) 

  return videos?.map(video=>{
    return{id: video.video_id, imgUrl: `http://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg`}
  });
}


export const getMyList = async (user_id,token) => {

  const videos = await getMyListVideos(user_id, token) 

  return videos?.map(video=>{
    return{id: video.video_id, imgUrl: `http://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg`}
  });
}