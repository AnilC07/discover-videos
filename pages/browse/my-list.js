import SectionCard from "@/components/Card/SectionCard";
import Navbar from "@/components/navbar/Navbar";
import Head from "next/head";

import styles from "../../styles/MyList.module.css";
import RedirectUser from "@/utils/redirectUser";
import { getMyList } from "@/lib/videos";

export const getServerSideProps = async (context) => {
  const {user_id, token} = await RedirectUser(context)

  // if (!user_id) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }


  const videos = await getMyList(user_id, token);
  return { props: { myListVideos: videos } };
};

const MyList = ({ myListVideos }) => {
  return (
    <>
      <Head>My list</Head>
      <main className={styles.main}>
        <Navbar className={styles.sectionWrapper} />
        <div>
          <SectionCard
            title="My list"
            size="small"
            videos={myListVideos}
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </>
  );
};

export default MyList;
