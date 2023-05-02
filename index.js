const express = require('express');
const cors = require('cors');
const { connection } = require('./configs/db');
const { userRouter } = require('./routes/user.routes');
const { postRouter } = require('./routes/post.routes');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req, res) => {
    res.status(200).send({msg:'Basic API endpoint'});
})

app.use('/api',userRouter);
app.use('/api',postRouter);

app.listen(process.env.port,async () => {
    try {
     await connection
     console.log('connected to DB 🌿');
    }
    catch (error) {
        console.log(error);
        console.log('error while connecting with DB ⚠️')
    }
    console.log(`Server is running at 4500🏃🏻`);
})