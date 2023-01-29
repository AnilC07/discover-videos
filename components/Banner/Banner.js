import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./banner.module.css";

const Banner = ({ title, subTitle, imgUrl, videoId }) => {
  const router = useRouter();
  const handleOnPlay = () => {

    router.push(`/video/${videoId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>
          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWitheIcon} onClick={handleOnPlay}>
              <Image
                src="/static/playIcon.svg"
                alt="playIcon"
                width="32"
                height="32"
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      {/* DÉCLARE LE STYLE DU BACKGROUND DE FACON INLINE POUR LE RENDRE DYNAMIC */}
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
        }}
      ></div>
    </div>
  );
};

export default Banner;
