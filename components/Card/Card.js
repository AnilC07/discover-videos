import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion"
import cls from 'classnames'

import styles from "./Card.module.css";

const Card = (props) => {

  // Define default values for imgUrl and size
  const {
    imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=859&q=80",
    size = "medium", id
  } = props;

  // State for image source
  const [imgSrc, setImgSrc] = useState(imgUrl); // By default, it's the image provide 

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = () => {
    // console.log("hii Error");
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=859&q=80"
    );
  };

const scale = id === 0 ? {scaleY:1.1} : {scale : 1.1}

  return (
    <div className={styles.container}>
      <motion.div className={cls(styles.imgMotionWrapper, classMap[size])} whileHover={{...scale}} >
        <Image
        id={id}
          src={imgSrc}
          alt="image"
          fill="true"
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
