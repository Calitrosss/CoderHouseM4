import express from "express";

const PORT = 8080;
const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Proyecto Final - 1ra. Pre-entrega");
});

app.listen(PORT, async () => {
  console.log(`Listening to port ${PORT}`);
});
