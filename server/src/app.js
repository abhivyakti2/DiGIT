require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const app = express();

const userRoutes = require('./routes/userRoutes');
const repoRoutes = require('./routes/repoRoutes');
const commitRoutes = require('./routes/commitRoutes');
const contributorRoutes = require('./routes/contributorRoutes')
const detailRoutes= require('./routes/detailRoutes')
const treeRoutes=require('./routes/treeRoutes')
const fileRoutes=require('./routes/fileRoutes')
const aiRoutes=require('./routes/aiRoutes')

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }
  ));
  app.use(express.json());
  
app.use('/api/users', userRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/commits', commitRoutes);
app.use('/api/contributors', contributorRoutes)
app.use('/api/details', detailRoutes)
app.use('/api/github', treeRoutes)
app.use('/api/file', fileRoutes)
app.use('/api/askAI', aiRoutes)

  const PORT = process.env.PORT;
  app.listen(PORT,()=>console.log(`Server on ${PORT}`));