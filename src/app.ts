import express, {Express} from 'express'
import route from './routes/details';

const app:Express = express();

app.use(express.json())

app.use(route)

app.listen(3000,()=>{
    console.log('listening to the port 3000')
})
