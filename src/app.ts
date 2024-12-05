import express from "express"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.route('/')
    .get((req,res)=>{
        res.send("hello")
    })
    
export default app