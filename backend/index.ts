import express from 'express';
import { router as flashcardsRouter } from './src/routes/flashcards';
import './src/utils/dbConnect'; // Importing the module will execute the connection logic


const app = express();
const PORT = process.env.PORT || 3000;


app.use('/api', flashcardsRouter);


app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
