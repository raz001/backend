const express = require('express');
const app = express();
const {connection} = require("./db");
require("dotenv").config()
const cors = require('cors');
const { userRouter } = require('./routes/user.routes');
const { postRouter } = require('./routes/post.route');

app.use(cors())
app.use(express.json());
app.use("/users", userRouter);
app.use('/posts', postRouter)

app.listen(process.env.port, async() => {
    try {
        await connection;
  console.log('connected to db');
  console.log(`server is runing at port ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
  
})