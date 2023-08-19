import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import styles from "@/app/styles/Home.module.css";
// import { findOrCreateUser } from "@/lib/serv-actions/findOrCreateUser";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Aimm Learning</title>
        <meta
          name="description"
          content="Aimm Learning - Efficient Learning with Mind Mapping"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>Aimm Learning</header>
      <main className={styles.main}>
        <section className={styles.about}>
          <h2>About Us</h2>
          <p>
            Aimm Learning is an online platform that uses the psychology of mind
            mapping for more efficient learning. Our innovative approach helps
            students and professionals alike to better understand, retain, and
            apply new information. By leveraging the power of mind mapping, we
            make learning more engaging, enjoyable, and effective.
          </p>
        </section>
        <section className={styles.contact}>
          <h2>Contact Us</h2>
          <p>
            If you have any questions or would like to learn more about Aimm
            Learning, please feel free to reach out to us:
          </p>
          <ul>
            <li>Email: info@aimmlearning.com</li>
            <li>Phone: +1 (123) 456-7890</li>
          </ul>
        </section>
        <div className={styles.linkContainer}>
          <li>
            <Link href="/flow_dashboard"> Flow Dashboard </Link>
          </li>
          <li>
            <Link href="/textedit"> Flow Dashboard </Link>
          </li>
        </div>
      </main>
    </div>
  );
};

export default Home;
