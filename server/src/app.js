require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get('/api/health', (req,res)=>res.json({status:'OK'}));
  const PORT = process.env.PORT;
  app.listen(PORT,()=>console.log(`Server on ${PORT}`));