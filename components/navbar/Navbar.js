import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "./navbar.module.css";

const Navbar = ({ userName }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropDown = (e) => {
    e.preventDefault();

    // Facon simple de faire un toggle
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src={"/static/netflix.svg"}
              alt="Netflix Logo"
              width={128}
              height={34}
            />
          </div>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropDown}>
              <p className={styles.username}>{userName}</p>
              <Image
                src={"/static/expand-arrow.svg"}
                alt="expand arrow"
                width={24}
                height={24}
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropDown}>
                <div>
                  <Link href="/login" className={styles.linkName}>
                    Sign Out
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
