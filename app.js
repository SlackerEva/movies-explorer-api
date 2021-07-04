const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { middleError } = require('./middlewares/middleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not_found_error');

dotenv.config();

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use(cors({
  origin: NODE_ENV === 'production' ? 'https://slacker.students.nomoredomains.monster' : 'http://localhost:3001',
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.all('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errorLogger);
app.use(errors());
app.use(middleError);

async function main() {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);
}

main();
