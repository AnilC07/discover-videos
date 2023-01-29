import Link from "next/link";
import React from "react";
import Card from "./Card";
import cls from "classnames";

import styles from "./sectionCard.module.css";

const SectionCard = (props) => {
  const { title, size, videos = [], shouldWrap = false, shouldScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(shouldWrap && styles.wrap, styles.cardWrapper)}>
        {videos.map((video, idx) => {
          {

          }
          return (
            <Link href={`/video/${video.id}`} key={idx}>
              <Card
                key={idx}
                id={idx}
                imgUrl={video.imgUrl}
                size={size}
                shouldScale={shouldScale}
              />
              ;
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCard;
