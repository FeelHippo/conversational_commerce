require('dotenv').config()

const http = require('http');
const createContainer = require('./inversion_of_control/dependency_injection');
const { queryAgent } = require('./controllers');

http.createServer(async (req, res) => {

  const { Agent } = createContainer();

  const { method } = req;
  switch(method) {
    case 'GET':
      await queryAgent(req, res, Agent.query);
      break;
    default:
      console.log('Method not recognized');
  }
}).listen(3003, () => console.log('Server running on port 3000'));
