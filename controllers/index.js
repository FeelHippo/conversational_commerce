export const queryAgent = async (body, res, query) => {
  try {
    const answer = await query(body.messages);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(answer));
  } catch (error) {
    res.end();
  }
};
