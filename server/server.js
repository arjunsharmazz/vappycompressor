const app = require('./app');

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`Vappy Compressor server running on port ${port}`);
});