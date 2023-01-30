import { useRouter } from "next/router";
import cls from "classnames";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import styles from "../.././styles/video.module.css";

import { getYoutubeVideoById } from "../../lib/videos";
import Navbar from "@/components/navbar/Navbar";
import Like from "@/components/icons/like-icons";
import DisLike from "@/components/icons/dislike-icon";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = [
    "xjDjIWPwcPU",
    "d9MyW72ELq0",
    "jAy6NJ_D5vU",
    "f9OKL5no-S0",
    "T3T-evQZiQo",
    "nWHUjuJ8zxE",
    "sGbxmsDFVnE",
  ];

  // Get the paths we want to pre-render based on posts
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const router = useRouter(); 

  const video_id = router.query.videoId;

  useEffect(() => {
    const fetchInFrontSide = async () => {
      const response = await fetch(`/api/stats?video_id=${video_id}`, {method:"GET"});
      const data = await response.json();
   
      if(data.length > 0){
        const favourited = data[0].favourited

        if(favourited===1){
          setToggleLike(true)

        }else{
          setToggleDisLike(true)

        }
      }
    };

    fetchInFrontSide()
  });

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount },
  } = video;

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        video_id,
        favourited,
      }),
    });
  };

  const handleToggleLike = async (e) => {
    setToggleLike(!toggleLike);
    setToggleDisLike(toggleLike);

    const val = !toggleLike;
    const favourited = val ? 1 : 0;

    const response = await runRatingService(favourited);
  };

  const handleToggleDisLike = async (e) => {
    const val = !toggleDisLike;

    setToggleDisLike(val);
    setToggleLike(toggleDisLike);
    const favourited = val ? 0 : 1;

    const response = await runRatingService(favourited);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        className={styles.modal}
        contentLabel="Watch the video"
        onRequestClose={() => {
          router.back();
        }}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`http://www.youtube.com/embed/${video_id}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
        />
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleDisLike}>
              <div className={styles.btnWrapper}>
                <DisLike selected={toggleDisLike} />
              </div>
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subTextWrapper, styles.subText)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subTextWrapper, styles.subText)}>
                <span className={styles.textColor}>View count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
