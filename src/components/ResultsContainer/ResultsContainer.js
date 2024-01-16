import React, { useEffect, useState } from "react";
import axios from "axios";
import { run } from "../../postVotes";

import "../ResultsContainer/ResultsContainer.scss";

const ResultContainer = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sending, setSending] = useState(false);
  const [mesaNumber, setMesaNumber] = useState("");
  const [byMesa, setByMesa] = useState(false);
  const [resultsByMesa, setResultsByMesa] = useState([]);

  const handleResultsByMesa = () => {
    fetchDataByMesa();
    setByMesa(true);
  };

  const handleTotalResults = ()=>{
    setByMesa(false)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://n3fzkyx0si.execute-api.us-east-2.amazonaws.com/test/results"
      );
      setResults(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const fetchDataByMesa = async () => {
    try {
      const response = await axios.get(
        "https://n3fzkyx0si.execute-api.us-east-2.amazonaws.com/test/resultsbymesa"
      );
      setResultsByMesa(response.data);
      console.log("result by mesa", response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const reset = async () => {
    try {
      console.log("please wait ...");
      setLoading(true);
      const response = await axios.post(
        "https://n3fzkyx0si.execute-api.us-east-2.amazonaws.com/test/reset"
      );
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
    setLoading(false);
    setResults([]);
    setByMesa(false)
    setResultsByMesa([])
    setElapsedTime(0); // Reiniciar el tiempo al hacer reset
  };

  const handleRunClick = async () => {
    setSending(true);
    await run(mesaNumber);
    fetchData();
    setSending(false);
    setByMesa(false);
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
    <div className="row">
      <div className = "scrollable-container">
      <h1>Votes Results</h1>
      {!byMesa &&
        results
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .map((result, index) => (
            <p
              className={index === 0 && !loading ? "blink-text winner" : ""}
              key={result.totalVotes}
            >
              {index + 1}. {result.candidateName} {result.totalVotes}
            </p>
          ))}
      {byMesa && (
        <div className="scrollable-container" >
          {resultsByMesa.map((mesa) => (
            <div key={mesa.mesaID}>
              <p>{`Mesa ${mesa.mesaID}`}</p>
              <ul>
                {mesa.candidates.map((candidate) => (
                  <li key={candidate.candidateName}>
                    {`${candidate.candidateName}: ${candidate.totalVotes} votos`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      </div>
      
      {!loading && (
        <div className="block">
          
            <input
                type="text"
                placeholder="Enter mesa number"
                value={mesaNumber}
                onChange={(e) => setMesaNumber(e.target.value)}
            />
            
          <button className="buttons" onClick={handleRunClick}>
            {sending ? "PROCESSING ..." : "SEND RANDOM VOTES"}
          </button>
          <button className="buttons" onClick={handleTotalResults}>
            TOTAL RESULTS
          </button>
          <button className="buttons" onClick={handleResultsByMesa}>
            RESULTS BY MESA
          </button>
          
          {results.length !== 0 && (
            <button className="buttons" onClick={reset}>
              RESET VOTATION
            </button>
          )}
        </div>
      )}
      {loading && (
        <p className="blink-text">DATABASE IS BEING RESTORED, PLEASE WAIT</p>
      )}
      {loading && (
        <p>ELAPSED TIME {elapsedTime} seconds - AVERAGE TIME 20 seconds</p>
      )}
    </div>
  );
};

export default ResultContainer;
