import React, { useEffect, useState } from "react";
import axios from "axios";
import { run } from '../../postVotes';

import '../ResultsContainer/ResultsContainer.scss';

const ResultContainer = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://n3fzkyx0si.execute-api.us-east-2.amazonaws.com/test/results");
      setResults(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const reset = async () => {
    try {
      console.log("please wait ...");
      setLoading(true);
      const response = await axios.post("https://n3fzkyx0si.execute-api.us-east-2.amazonaws.com/test/reset");
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
    setLoading(false);
    setResults([]);
    setElapsedTime(0); // Reiniciar el tiempo al hacer reset
  };

  const handleRunClick = async () => {
    await run();
    fetchData(); // Después de ejecutar run, volver a obtener los resultados
  };

  useEffect(() => {
    let intervalId;
    
    if (loading) {
      // Iniciar un intervalo que actualiza el tiempo cada segundo
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // Limpiar el intervalo cuando el estado de carga cambia
      clearInterval(intervalId);
    }

    // Limpiar el intervalo al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, [loading]);

  return (
    <div className='row'>
      <h1>Votes Results</h1>
      {results
  .sort((a, b) => b.totalVotes - a.totalVotes)
  .map((result, index) => (
    <p className={index === 0 && !loading ? "blink-text winner" : ""} key={result.totalVotes}>
        {index + 1}. {result.candidateName} {result.totalVotes}
    </p>

  ))}

      <button className='btn-success' onClick={reset}>RESET VOTATION</button>
      <button onClick={handleRunClick}>SEND RANDOM VOTES</button>
      {loading && <p className="blink-text">DATABASE IS BEING RESTORED, PLEASE WAIT</p>}
      {loading && <p >ELAPSED TIME {elapsedTime} seconds - AVERAGE TIME 20 seconds</p>}
    </div>
  );
};

export default ResultContainer;
