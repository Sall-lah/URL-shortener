const express = require('express');
const port = 4000;
const app = express();

// Redirect to the source URL
app.get('/:UID', async(req, res) => {
    const UID = req.params.UID;
    try{
        const response = await fetch(`http://localhost:3000/api/${UID}`);
        const data = await response.json();
        res.redirect(data.source);
    }
    catch(e){
        console.log(e);
    }
})

app.listen(port, async () => {
    console.log(`Connected to App`);
})