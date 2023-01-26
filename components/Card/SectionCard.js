import Link from "next/link";
import React from "react";
import Card from "./Card";

import styles from "./sectionCard.module.css";

const SectionCard = (props) => {
  const { title, size, videos = [] } = props;
  // console.log(videos);
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => {
          {
            /* console.log({ video }); */
          }
          return (
            <Link href={`/video/${video.id}`} key={idx}>
              <Card key={idx} id={idx} imgUrl={video.imgUrl} size={size} />;
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCard;
