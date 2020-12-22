import React, { useState } from 'react';
import './stopwatch.css';

import { Subscription } from 'rxjs';
import { displayedTime} from '../interfaces/displayed-time'

type stopwatchProps = {
  stopwatchServiceStartTimer: Function;
  stopwatchServiceTimerStream: any;
  stopwatchServiceResetTimer: Function;
  timeForDisplay: displayedTime;
  unsubscr: Function;
};

export const Timer: React.FC<stopwatchProps> = ({
  stopwatchServiceStartTimer,
  stopwatchServiceTimerStream,
  stopwatchServiceResetTimer,
  timeForDisplay,
  unsubscr
}) => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const [startButton, setStartButton] = useState('Start');
  const [isStarted, setIsStarted] = useState(false);
  const [isWait, setIsWait] = useState(false);

  let lastClick!: number;
  let subscription!: Subscription;

  function stopwatchUnsubcribe() {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  function runStopwatch(): void {
    if (!isStarted) {
      if (!isWait) {
        stopwatchServiceStartTimer();
      }
      else if (isWait) {
        let currentTime = (+timeForDisplay.h * 3600 + +timeForDisplay.m * 60 + +timeForDisplay.s) * 1000;
        stopwatchServiceStartTimer(currentTime);
      }
      subscription = stopwatchServiceTimerStream.subscribe((time: any) => {
        timeForDisplay = time;

        setHours(String(timeForDisplay.h));
        setMinutes(String(timeForDisplay.m));
        setSeconds(String(timeForDisplay.s));
      });
      setStartButton('Stop');
    }
    else {
      unsubscr();
      stopwatchUnsubcribe();
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setStartButton('Start');
    }
    setIsStarted(!isStarted);
  }

  function pauseStopwatch(event: any): void {
    if (lastClick) {
      let diff = event.timeStamp - lastClick;
      if (diff <= 300) {
        stopwatchUnsubcribe()
        unsubscr();
        setIsStarted(false);
        setIsWait(true);
        setStartButton('Start');
      }
    }
    lastClick = event.timeStamp;
  }

  function resetStopwatch(): void {
    stopwatchServiceResetTimer();
  }

  return (
    <div className="time-container">
      <span className="time">{hours}:{minutes}:{seconds}</span>
      <div className="control-panel">
        <button
          className="button green-button"
          onClick={() => runStopwatch()}
        >
          {startButton}
        </button>
        <button
          disabled={!isStarted}
          className="button"
          onClick={(event) => pauseStopwatch(event)}
        >
          Wait
        </button>
        <button
          disabled={!isStarted}
          className="button reset-button"
          onClick={() => resetStopwatch()}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
