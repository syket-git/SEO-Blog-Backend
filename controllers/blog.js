exports.time = (req, res) => {
  res.send({ date: new Date().toLocaleString() });
};
