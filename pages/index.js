import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  const audioRef = useRef(typeof Audio !== "undefined" && new Audio());
  //TODO: Add a way to change the audio source
  const [audioSrc, setAudioSrc] = useState("/beep.mp3");
  const [desiredMinutes, setDesiredMinutes] = useState(5);
  const [desiredSeconds, setDesiredSeconds] = useState(0);
  const [desiredRestMinutes, setDesiredRestMinutes] = useState(1);
  const [desiredRestSeconds, setDesiredRestSeconds] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const startTimer = () => {
    setIsResting(false);
    setIsRunning(true);
    setMinutes(desiredMinutes);
    setSeconds(desiredSeconds);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsResting(false);
    setMinutes(desiredMinutes);
    setSeconds(desiredSeconds);
  };

  const toggleRunningResting = () => {
    if (isRunning) {
      setMinutes(desiredRestMinutes);
      setSeconds(desiredRestSeconds);
      setIsRunning(false);
      setIsResting(true);
    } else if (isResting) {
      setMinutes(desiredMinutes);
      setSeconds(desiredSeconds);
      setIsRunning(true);
      setIsResting(false);
    }
  };

  useEffect(() => {
    // add event listener for space bar
    document.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        if (isRunning || isResting) {
          stopTimer();
        } else {
          startTimer();
        }
      }
    });

    // timer logic: this will run every second
    let interval = setInterval(() => {
      clearInterval(interval);
      if (isRunning || isResting) {
        if (seconds == 0) {
          if (minutes == 0) {
            // play audio
            if (audioRef.current) {
              audioRef.current.src = audioSrc;
              audioRef.current.play();
            } else {
              console.log("Audio not supported");
            }
            toggleRunningResting();
          } else {
            setSeconds(59);
            setMinutes(minutes - 1);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, minutes, audioRef, audioSrc, isRunning, isResting]);

  return (
    // if the timer is running, set the background color to green, otherwise set it to red
    <div
      className={
        isRunning ? styles.running : isResting ? styles.resting : styles.default
      }
    >
      <Head>
        <title>Inverted Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Debug Information */}
        {/* <div className={styles.debug}>
          <p>isRunning: {isRunning.toString()}</p>
          <p>isResting: {isResting.toString()}</p>
          <p>minutes: {minutes}</p>
          <p>seconds: {seconds}</p>
          <p>desiredMinutes: {desiredMinutes}</p>
          <p>desiredSeconds: {desiredSeconds}</p>
          <p>desiredRestMinutes: {desiredRestMinutes}</p>
          <p>desiredRestSeconds: {desiredRestSeconds}</p>
        </div> */}

        {/* Timer */}
        <div className={styles.timerWrapper}>
          <h1 className={styles.timer}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        </div>

        <div className={styles.controls}>
          {/* create display for desired number of minutes */}
          <h2>Minutes: {desiredMinutes}</h2>
          {/* create display for desired number of seconds */}
          <h2>Seconds: {desiredSeconds}</h2>
          {/* create display for desired number of rest minutes */}
          <h2>Rest Minutes: {desiredRestMinutes}</h2>
          {/* create display for desired number of rest seconds */}
          <h2>Rest Seconds: {desiredRestSeconds}</h2>
        </div>
        <div className={styles.controls}>
          {/* create input to set the desired number of minutes */}
          <input
            type="number"
            placeholder="Minutes"
            value={desiredMinutes}
            onChange={(e) => {
              setDesiredMinutes(e.target.value);
              setMinutes(e.target.value);
            }}
          />
          {/* create input to set the desired number of seconds */}
          <input
            type="number"
            placeholder="Seconds"
            value={desiredSeconds}
            onChange={(e) => {
              setDesiredSeconds(e.target.value);
              setSeconds(e.target.value);
            }}
          />
          {/* create input to set the desired number of rest minutes */}
          <input
            type="number"
            placeholder="Rest Minutes"
            value={desiredRestMinutes}
            onChange={(e) => setDesiredRestMinutes(e.target.value)}
          />
          {/* create input to set the desired number of rest seconds */}
          <input
            type="number"
            placeholder="Rest Seconds"
            value={desiredRestSeconds}
            onChange={(e) => setDesiredRestSeconds(e.target.value)}
          />
        </div>

        <div className={styles.controls}>
          {!isRunning && !isResting && (
            <button onClick={startTimer} className={styles.startButton}>
              Start
            </button>
          )}
          {(isRunning || isResting) && (
            <button onClick={stopTimer} className={styles.stopButton}>
              Stop
            </button>
          )}
        </div>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
