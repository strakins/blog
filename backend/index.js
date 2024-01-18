const express = require('express');
const cors = require('cors');
const {connect} = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload')


const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')




const app = express();

app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: "https://strakins-blog.vercel.app/"}));
app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'))


app.use('/api/users', userRoutes) 
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)

connect(process.env.MONGDB_URI).then(app.listen(process.env.PORT || 5000, () => console.log(`Server Running on port ${process.env.PORT}, Database Connected Successfully`))).catch(error=>(console.log(error)))

