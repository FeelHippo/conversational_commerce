export const bodyParser = async (req) => {
  return new Promise((resolve, _reject) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => resolve(body));
    req.on('error', console.error);
  });
};