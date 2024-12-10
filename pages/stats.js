import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Stats() {
  const [data, setData] = useState([]);

  async function fetchKeys() {
    try {
      const response = await fetch("/api/getKeys", {
        method: "GET",
      });
      const resJson = await response.json();
      const keysAndValues = resJson.values;
      if (Array.isArray(keysAndValues)) {
        setData(keysAndValues);
      } else {
        console.error("Error: Response is not an array");
        console.error(keysAndValues);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []); // Empty array ensures useEffect runs only once

  return (
    <div className={styles.container}>
      <Head>
        <title>Stats</title>
        <meta name="description" content="Statistics Page" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Statistics</h1>
        <p className={styles.description}>This is the statistics page.</p>
        {/* data is an array of objects. each object has only 1 key and 1 value. Loop over the keys and values and display them in a list */}
        <ul>
          {data.length === 0 && <li>No keys found</li>}
          {data.map((obj) => {
            const key = Object.keys(obj)[0];
            const value = obj[key];
            return (
              <li key={key}>
                <strong>{key}</strong>: {value}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
