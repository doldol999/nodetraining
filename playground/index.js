const fs = require('fs');

const dataBuffer = fs.readFileSync('1-json.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);

console.log(`Hi I am ${data.name} from planet ${data.planet} and I am ${data.age} years old.`);

//Change data

data.name = 'Dextre Lumbao';
data.age = '10 weeks and 5 days';
data.planet = 'Earth';

console.log(`Hi I am ${data.name} from planet ${data.planet} and I am ${data.age} old.`);

//Save the data

const dataToSave = JSON.stringify(data);
fs.writeFileSync('1-json.json',dataToSave);