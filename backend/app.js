const http = require('http');
import { routes } from './routes'



const hostname = 'localhost';
const port = 3001;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PATCH,PUT,POST,DELETE');
	res.end('Welcome!');
});

server.listen(port, hostname, () => {
	console.log(`Server listening to ${hostname}:${port}`);
});