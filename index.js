require('dotenv').config()

const http = require('http');
const createContainer = require('./inversion_of_control/dependency_injection');
const { queryAgent } = require('./controllers');
const { bodyParser } = require('./utils/body_parser.js');

http.createServer(async (req, res) => {

  const { Agent } = createContainer();

  const { method } = req;
  switch(method) {
    case 'POST':
      await queryAgent(
        JSON.parse(await bodyParser(req)),
        res,
        Agent.query,
      );
      break;
    default:
      console.log('Method not recognized');
  }
}).listen(8080, () => console.log('Server running on port 8080'));
