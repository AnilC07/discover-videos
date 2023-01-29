import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { magic } from "../lib/magic-client";

import styles from "../styles/login.module.css";

const Login = () => {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  //Permet de garder le state a true tant que la page n'est pas completement charger
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    const email = e.target.value;
    setEmail(email);
  };

  const handleLogInWithEmail = async (e) => {
    e.preventDefault();

    if (email) {
        try {
          setIsLoading(true);
          const didToken = await magic.auth.loginWithMagicLink({ email });

          if (didToken) {

            const response = await fetch("/api/login", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${didToken}`,
                "Content-Type": "application/json",
              },
            });

            const loggedInResponse = await response.json();

            if (loggedInResponse.done) {

              router.push("/");
            }else{
              setIsLoading(false)
              setUserMsg('Something went wrong')
            }
          }
        } catch (error) {
          // Handle errors if required!
          console.error("Something went wrong logging in", error);
          setIsLoading(false)
        }
      } else{
        // show user message
setIsLoading(false);
setUserMsg("Enter a valid email address");
}
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netlix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            className={styles.emailInput}
            type="text"
            placeholder="Email address"
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>

          <button className={styles.loginBtn} onClick={handleLogInWithEmail}>
            {isLoading ? "Loading" : "Sign in"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
