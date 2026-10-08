require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Pengecekan Environment Variables
if (!process.env.MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI belum diatur di file .env!');
  process.exit(1);
}

// Koneksi Database MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Terhubung Berhasil'))
  .catch((err) => console.error('Error MongoDB:', err));

// Route Tes Health Check
app.get('/', (req, res) => {
  res.send('API Backend Tentram Running...');
});

// Endpoint Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input sederhana
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });
    
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registrasi berhasil' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email atau password salah' });
    }

    const secretKey = process.env.JWT_SECRET || 'secretkey123';
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      secretKey, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Endpoint Update Profil (Edit Profil)
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ success: false, message: 'User ID dan nama wajib diisi' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
);

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));