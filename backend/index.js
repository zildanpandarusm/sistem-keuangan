import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoute from './routes/UserRoute.js';
import KaryawanRoute from './routes/KaryawanRoute.js';
import PendapatanRoute from './routes/PendapatanRoute.js';
import PengeluaranRoute from './routes/PengeluaranRoute.js';
import HutangRoute from './routes/HutangRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: 'auto',
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.use(AuthRoute);
app.use(UserRoute);
app.use(KaryawanRoute);
app.use(PendapatanRoute);
app.use(PengeluaranRoute);
app.use(HutangRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log('Server telah terhubung');
});
