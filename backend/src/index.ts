import express from 'express';
import { router as flashcardsRouter } from './routes/flashcards';
import authRouter from './routes/auth';
import './utils/dbConnect'; // Importing the module will execute the connection logic


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.use('/api', flashcardsRouter);

app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
