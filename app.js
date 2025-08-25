const validator = require('validator');
const express = require('express');
const port = 4000;
const app = express();

// EJS View Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded data (intinya buat nerima data dari form post)
app.use(express.static("public"));

// The Home Page
app.get('/', (req, res) => {
    res.render('main-layout', {
        page: 'contents/home',
        responseData: false,
        valid: true,
    });
})

// Add new URL
app.post('/', async(req, res, next) => {
    // Get URL from Input
    const data = req.body;

    // Chekk if URL Valid
    const valid = validator.isURL(data.source);

    try{
        if(valid){
            // Kirim Template data ke API dan Ambil Response nya
            const response = await fetch("http://localhost:3000/api", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            // Ubah Response nya menjadi JSON
            const responseData = await response.json();

            if (response.status === 201) {
                res.render('main-layout', {
                    page: 'contents/home',
                    responseData,
                    url: `${req.protocol}://${req.get('host')}`,
                    valid,
                });
            }
            else {
                res.status(500).send("Server Error");
            }
        }
        else{
            res.render('main-layout', {
                page: 'contents/home',
                responseData: false,
                valid,
            });
        }
    }
    catch(e){
        res.status(500).send('Error');
        console.log(e);
    }

})

// Redirect to the source URL
app.get('/:UID', async(req, res, next) => {
    const UID = req.params.UID;
    try{
        const response = await fetch(`http://localhost:3000/api/${UID}`);
        const data = await response.json();

        if(data.massage){
            next();
        }
        else{
            res.redirect(data.source);  
        }
        
    }
    catch(e){
        res.status(500).send(e);
    }
})

// If route is not found
app.use('/', (req, res) => {
    res.status(404).send("File not Found");
})

app.listen(port, async () => {
    console.log(`Connected to App`);
})