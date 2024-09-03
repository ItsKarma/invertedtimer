import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  const [desiredRounds, setDesiredRounds] = useState(0);
  const [roundsRemaining, setRoundsRemaining] = useState(0);
  const [desiredMinutes, setDesiredMinutes] = useState(0);
  const [desiredSeconds, setDesiredSeconds] = useState(5);
  const [desiredRestMinutes, setDesiredRestMinutes] = useState(0);
  const [desiredRestSeconds, setDesiredRestSeconds] = useState(3);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [restMinutes, setRestMinutes] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const stopTimer = () => {
    setIsRunning(false);
    setIsResting(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(desiredMinutes);
    setSeconds(desiredSeconds);
  };

  const startTimer = () => {
    setIsResting(false);
    setIsRunning(true);
    setMinutes(desiredMinutes);
    setSeconds(desiredSeconds);
    // runTimer();
  };

  const startRestTimer = () => {
    setIsResting(true);
    setIsRunning(false);
    setRestMinutes(desiredRestMinutes);
    setRestSeconds(desiredRestSeconds);
  };

  const startNextRound = () => {
    setRounds(roundsRemaining - 1);
    startTimer();
  };

  const runTimer = () => {
    if (isRunning) {
      if (minutes === 0 && seconds === 0) {
        startRestTimer();
      }
    }
    if (isResting) {
      if (restMinutes === 0 && restSeconds === 0) {
        if (roundsRemaining > 0) {
          startNextRound();
        } else {
          stopTimer();
        }
      }
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      clearInterval(interval);
      if (seconds === 0) {
        if (minutes !== 0) {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, minutes]);

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
        <div className="timer-wrapper">
          <h1 className={styles.timer}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
          <h1 className={styles.timer}>
            {restMinutes < 10 ? `0${restMinutes}` : restMinutes}:
            {restSeconds < 10 ? `0${restSeconds}` : restSeconds}
          </h1>
        </div>
        <div className="controls">
          {/* create display for desired number of rounds */}
          <h2>Rounds: {desiredRounds}</h2>
          {/* create display for remaining number of rounds */}
          <h2>Rounds Remaining: {roundsRemaining}</h2>

          {/* create input to set the desired number of rounds */}
          <input
            type="number"
            placeholder="Number of rounds"
            value={desiredRounds}
            onChange={(e) => setDesiredRounds(e.target.value)}
          />
          {/* create input to set the desired number of minutes */}
          <input
            type="number"
            placeholder="Minutes"
            value={desiredMinutes}
            onChange={(e) => setDesiredMinutes(e.target.value)}
          />
          {/* create input to set the desired number of seconds */}
          <input
            type="number"
            placeholder="Seconds"
            value={desiredSeconds}
            onChange={(e) => setDesiredSeconds(e.target.value)}
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

          {/* create button to start the timer */}
          <button
            onClick={startTimer}
            // disabled={isRunning || isResting}
            className="start-button"
          >
            Start Timer
          </button>
        </div>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
