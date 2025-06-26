export const queryAgent = async (_req, res, query) => {
  try {
    // client will be in charge of storing a list of queries
    // server shouls not store or cache
    const message = await query(['where is my order?', 'if I remember well, the order number is R156998803', 'my email is mobile.developer+22@on-running.com']);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message));
  } catch (error) {
    console.error(error);
  }
};
