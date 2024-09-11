import Head from "next/head";
import Script from "next/script";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FaRegMinusSquare, FaRegPlusSquare, FaBed } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import NoSsr from "./components/NoSsr";

export default function Home() {
  const audioRef = useRef(typeof Audio !== "undefined" && new Audio());
  //TODO: Add a way to change the audio source
  const [audioSrc, setAudioSrc] = useState("/beepLoud.mp3");
  const [audioVolume, setAudioVolume] = useState(1);
  const [desiredMinutes, setDesiredMinutes] = useState(5);
  const [desiredSeconds, setDesiredSeconds] = useState(0);
  const [desiredRestMinutes, setDesiredRestMinutes] = useState(1);
  const [desiredRestSeconds, setDesiredRestSeconds] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [time, setTime] = useState(new Date());

  async function incrementRounds() {
    try {
      await fetch("/api/incrementRounds", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

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

  const RestTimerSmall = () => {
    return (
      <div className={styles.timerSmallPlaceholder}>
        <p>
          <FaBed style={{ transform: "scaleX(-1)" }} />
          <span>
            &nbsp;&nbsp; <b>Rest Timer</b> &nbsp;&nbsp;
          </span>
          <FaBed />
        </p>
        <div className={styles.timerSmallContainer}>
          {!isRunning && !isResting && (
            <div>
              <div className={styles.iconButtonWrapper}>
                <button
                  className={styles.iconButtonSmall}
                  onClick={() => {
                    setDesiredRestMinutes(desiredRestMinutes + 1);
                  }}
                >
                  <FaRegPlusSquare />
                </button>
                <button
                  className={styles.iconButtonSmall}
                  onClick={() => {
                    if (desiredRestMinutes > 0) {
                      setDesiredRestMinutes(desiredRestMinutes - 1);
                    }
                  }}
                  disabled={desiredRestMinutes == 0}
                >
                  <FaRegMinusSquare />
                </button>
              </div>
            </div>
          )}
          <div>
            <h1 className={styles.timerSmall}>
              {desiredRestMinutes < 10
                ? `0${desiredRestMinutes}`
                : desiredRestMinutes}
              :
              {desiredRestSeconds < 10
                ? `0${desiredRestSeconds}`
                : desiredRestSeconds}
            </h1>
          </div>
          {!isRunning && !isResting && (
            <div className={styles.iconButtonWrapper}>
              <button
                className={styles.iconButtonSmall}
                onClick={() => {
                  const newRestSeconds = (desiredRestSeconds + 5) % 60;
                  setDesiredRestSeconds(newRestSeconds);
                }}
              >
                <FaRegPlusSquare />
              </button>
              <button
                className={styles.iconButtonSmall}
                onClick={() => {
                  const newRestSeconds =
                    desiredRestSeconds == 0 ? 55 : desiredRestSeconds - 5;
                  setDesiredRestSeconds(newRestSeconds);
                }}
              >
                <FaRegMinusSquare />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Timer = () => {
    return (
      <div className={styles.timerContainer}>
        {!isRunning && !isResting && (
          <div className={styles.iconButtonWrapper}>
            <button
              className={styles.iconButton}
              onClick={() => {
                setDesiredMinutes(desiredMinutes + 1);
                setMinutes(desiredMinutes + 1);
              }}
            >
              <FaRegPlusSquare />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => {
                if (desiredMinutes > 0) {
                  setDesiredMinutes(desiredMinutes - 1);
                  setMinutes(desiredMinutes - 1);
                }
              }}
              disabled={desiredMinutes == 0}
            >
              <FaRegMinusSquare />
            </button>
          </div>
        )}
        <div>
          <h1 className={styles.timer}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        </div>
        {!isRunning && !isResting && (
          <div className={styles.iconButtonWrapper}>
            <button
              className={styles.iconButton}
              onClick={() => {
                const newSeconds = (desiredSeconds + 5) % 60;
                setDesiredSeconds(newSeconds);
                setSeconds(newSeconds);
              }}
            >
              <FaRegPlusSquare />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => {
                const newSeconds =
                  desiredSeconds == 0 ? 55 : desiredSeconds - 5;
                setDesiredSeconds(newSeconds);
                setSeconds(newSeconds);
              }}
            >
              <FaRegMinusSquare />
            </button>
          </div>
        )}
      </div>
    );
  };

  const Clock = () => {
    // return html displaying the current time
    // we use NoSsr to prevent server-side rendering of the time which causes hydration issues
    return (
      <div className={styles.clockContainer}>
        <p>
          <NoSsr>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </NoSsr>
        </p>
      </div>
    );
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

    // timer logic: this will run every 10 seconds
    let timeInterval = setInterval(() => {
      // update the time
      let nwDate = new Date();
      setTime(nwDate);
    }, 1000);

    // timer logic: this will run every second
    let interval = setInterval(() => {
      clearInterval(interval);
      if (isRunning || isResting) {
        if (minutes == 0 && seconds == 1) {
          // play audio
          if (audioRef.current) {
            audioRef.current.volume = audioVolume;
            audioRef.current.src = audioSrc;
            audioRef.current.play();
          } else {
            console.error("Audio Error");
            toast.error("Audio Error", { duration: 10000 });
          }
          // increment rounds
          if (isRunning) {
            incrementRounds();
          }
        }
        if (seconds == 0) {
          if (minutes == 0) {
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

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
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
        {/* to prevent Firefox FOUC, this must be here */}
        <Script>0</Script>
      </Head>

      <main>
        {/* Toaster - Keep at top */}
        <NoSsr>
          <Toaster position="top-right" />
        </NoSsr>

        {/* Clock */}
        <Clock />

        {/* Timer */}
        <Timer />

        {/* Start/Stop */}
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

        {/* Small Rest Timer */}
        <div>
          {!isRunning && !isResting ? (
            <RestTimerSmall />
          ) : (
            <div className={styles.controlsPlaceholder} />
          )}
        </div>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
