import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { magic } from "../../lib/magic-client";

import styles from "./navbar.module.css";

// const Navbar = ({ userName }) => { => changement, on recupere le username avec magic
const Navbar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [didToken, setDidToken] = useState("");

  useEffect(() => {
    // Assumes a user already logged in
    async function getUserName() {
      try {
        const { email, issuer } = await magic.user.getMetadata();

        const didToken = await magic.user.getIdToken();

        if (email) {
          setUsername(email);
          setIsLogged(true);
        }
      } catch (error) {
        // Handle error if required!
        console.log("Error retrieving email", error);
      }
    }
    getUserName();
  }, []);

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

  const handleSignOut = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      console.log({res})
      setIsLogged(false);
      // router.push("/login");
    } catch (error) {
      // Handle error if required!
      console.error("Error logging out", error);
      router.push("/login");

      // console.log("Error logging out", error);
    }
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
              <p className={styles.username}>
                {isLogged ? `${username}` : "username"}
              </p>
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
                  <Link
                    href="/login"
                    className={styles.linkName}
                    legacyBehavior={true}
                  >
                    <a onClick={handleSignOut}>Sign Out</a>
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
