import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// app config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser tools
    if (!origin) return callback(null, true)

    const allowed = [
      process.env.FRONTEND_URL, // example: https://your-frontend.vercel.app
      process.env.ADMIN_URL,    // example: https://your-admin.vercel.app
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ].filter(Boolean).map(u => u.replace(/\/$/, ''))

    const normalized = origin.replace(/\/$/, '')
    if (allowed.includes(normalized)) return callback(null, true)

    console.warn('Blocked CORS origin:', origin)
    return callback(new Error('CORS not allowed by server'))
  },
  credentials: true
}))
app.use(express.json());

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

//localhost:4000/api/admin/add-doctor

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));