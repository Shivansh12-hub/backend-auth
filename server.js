import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import { authRouters } from './routes/authRoutes.js'
import { userRouter } from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// api end points 
app.get("/", (req, res) => res.send("api working"));
app.use('/api/auth', authRouters);
app.use('/api/user', userRouter); 

app.listen(port,host, () => console.log(`server is started on port : ${port}`));
    
// hello  