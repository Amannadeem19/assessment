import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();

app.use(bodyParser.json({limit:"30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));
dotenv.config();

const PORT = 5000;
const token  = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;


// Handle incoming messages from webhook of maytapi api
const api = `https://api.maytapi.com/api/68647aae-01f1-46cb-ac2f-93fb59d82549/28729?access_token = ' + ${token}`;

app.post(`/${api}`, async (req, res) => {
    try {
        const {access_token} = req.params;
      const {chatId,message} = req.body;
      if(mytoken !== access_token){
        return res.status(403).send({message:"access denied"});
      }  

      const response_msg = await processMessage(message);
  
      // Send the response back to the user using the Maytapi API
      await axios({
        method: 'POST',
        url : api,
        data:{
            chatId: chatId,
        text: response_msg,
        },

        headers : {
            "Content-Type" : "application/json",
            "x-maytapi-key": "a4391547-41a3-45d4-af75-dde5afa3fcb7"

        }
    });
  
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
  

  let count = 0;
  let count2 = 0;
  // Process the user's message and generate a response
  async function processMessage(message) {
 

        if(message === 'hi' || message === 'hey' || message === 'hello'){
            
            return 'Hi, Welcome to TechOn. How may we help you today? 1. Customer Support 2. Sales'
        }
        if(message === '1' && count ===  0 ) {
            count++;
            return `we'll connect you to support shortly`;
        } 
        if (message === '2' && count2 === 0) {
            count2++;
            return 'Sales will reach out to you'
        }
        if(count2 >=  1 && count >= 1){
            return 'Is there anything else i can do for you? 1. yes 2. No'
        }
        if(count === 1 ){
            count++;
            return 'Please type your query'
        }
        if(count === 2){
            count++;
            return 'thanks we will look into it'
        }
        if(count2 === 1){
            return 'thanks for your time'
        }

  }
const start = async() =>{ 

    app.listen(PORT, ()=>{
        console.log(`Server is listening on Port ${PORT}` );
    })
}

start();