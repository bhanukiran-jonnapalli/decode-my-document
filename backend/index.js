
require('dotenv').config(); // loads .env file and puts everything into process.env

const express = require('express');
const cors = require('cors');

const app = express(); // think of express() is turning engine on app is object we use for everything

const PORT = process.env.PORT || 3000;

app.use(cors({origin : 'http://localhost:4200'}));

app.use(express.json());

const decodeRoute = require('./routes/decode')
app.use('/api/decode', decodeRoute)

app.get('/',(req,res)=>{
    res.json({ message: 'Decode My Document API is running' });
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

// require packages → create app → add middleware → define routes → start listening