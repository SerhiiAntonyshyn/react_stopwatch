import React from 'react';

import { timer, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { displayedTime } from '../interfaces/displayed-time';
import { Timer } from '../stopwatch/stopwatch';


export const StopwatchService = () => {
  const time: Observable<number> = timer(0, 1000);
  let startTime!: number;
  let timerTimeInMS!: number;
  let subscription!: Subscription;
  const timeForDisplay: displayedTime = {
    h: "00",
    m: "00",
    s: "00"
  };

  let timerStream: BehaviorSubject <displayedTime> = new BehaviorSubject<displayedTime>(timeForDisplay);


  function startTimer(initialTime? : number){
    if (!initialTime){
      startTime = Date.now();
    }
    else{
      startTime = Date.now() - initialTime;
    }
    subscription = time.subscribe(()=>{
      timerTimeInMS = Date.now() - startTime;
      convertTime();
      timerStream.next(timeForDisplay);
    });
    return timerStream.asObservable();
  }

  function convertTime():void{
    let sec: number = Math.round(timerTimeInMS / 1000);
    let s: number = sec % 60;
    let h: number = Math.floor(sec / 60 / 60);
    let m: number = (Math.floor(sec / 60)) - (h * 60);
    if (h >= 10){
      timeForDisplay.h = String(h);
    }
    else timeForDisplay.h = String(`0${h}`);
    if (m >= 10){
      timeForDisplay.m = String(m);
    } 
    else timeForDisplay.m = String(`0${m}`);
    if (s >= 10){
      timeForDisplay.s = String(s);
    }  
    else timeForDisplay.s = String(`0${s}`);
  }

  function unsubscr() {
    subscription.unsubscribe();
  }

  function resetTimer(){
    subscription.unsubscribe();
    startTimer();
  }
  console.log(subscription);

  return (
    <div className="stopwatchService">
      <Timer
        stopwatchServiceStartTimer={startTimer}
        stopwatchServiceTimerStream={timerStream}
        stopwatchServiceResetTimer={resetTimer}
        timeForDisplay={timeForDisplay}
        unsubscr={unsubscr}
      />
    </div>
  )
}
