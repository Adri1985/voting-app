import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const lambdaEndpoint = 'https://n3fzkyx0si.execute-api.us-east-2.amazonaws.com/test/vote';

function getRandomCandidateID() {
  const candidates = ['Menem','Milei','Massa', 'Bulrich', 'Larreta','Bregman'];;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

async function sendVotes(votes) {
  try {
    const response = await axios.post(lambdaEndpoint, votes);
    console.log(response.data);
  } catch (error) {
    console.error('Error sending votes:', error.response ? error.response.data : error.message);
  }
}

const batchSize = 30;
let totalVotes = 300;
let sequence = 0;

const mesaNumber = 2;

if (!mesaNumber) {
  console.error('Numero de mesa es mandatorio');
  process.exit(1);
}

async function run() {
  console.log("starting run")
  const promises = Array.from({ length: totalVotes / batchSize }, (_, i) => {
    const votesBatch = Array.from({ length: batchSize }, () => ({
      ID: uuidv4(), // Generar un ObjectID único
      candidateName: getRandomCandidateID(),
      mesaID: mesaNumber,
    }));
    return sendVotes(votesBatch);
  });

  await Promise.all(promises);
}

run().catch((error) => console.error('Error during execution:', error));

export  {run};