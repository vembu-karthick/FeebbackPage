const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(bodyParser.json());
const uri ="mongodb+srv://vembu_karthick:0sJ98iEuQsh3qjxY@cluster0.mslvczx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const PORT=8080;

app.post('/feedback',async (req,res)=>{
    try{
        console.log(req.body);
        saveData(req.body);
    }
    catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});
async function saveData(data) {
    try {
            await client.connect();
            const collection = client.db('userInfo').collection('feedback');          
            await collection.insertOne(data);
        }
    catch (err) {
        console.log(err.stack);
       
    }    
    finally {
       
        await client.close();

        }
}
app.listen(PORT,()=>{
    console.log(`Server is running in ${PORT}`);
});