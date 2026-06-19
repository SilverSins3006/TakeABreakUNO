import { useState, useEffect } from "react";


function Timer(){
    const [seconds,setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    function startTimer(){
        setIsRunning(true);
        console.log("Timer started")
    }
    
    function pauseTimer(){
        setIsRunning(false);
        console.log("Timer Paused")
    }
    
    function resetTimer(time = 900){
        setIsRunning(false);
        setSeconds(time);

    }

    useEffect(() => {
        let interval;
        
        if(isRunning && seconds > 0){
            interval = setInterval(() => {
                setSeconds((previousSeconds) => previousSeconds - 1);
            }, 1000);
        }
        if (seconds === 0){
            setIsRunning(false);
            console.log("Take A Break, Timer Value 0");
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    
    

   /* return(
        <div>
            <button onClick={startTimer}>Start</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={() => resetTimer(900)}>Reset</button>

        </div>
    )
    */


}