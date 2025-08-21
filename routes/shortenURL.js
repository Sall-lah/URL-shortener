const express = require('express');
const router = express.Router();
const link = require('../models/URLSchema');
const crypto = require('crypto');

// Middle Ware
const getSource = async (req, res, next) => {
    let detail;
    try{
        detail = await link.findOne({ UID: req.params.UID});
        console.log(detail);
        // Jika id tidak ditemukan maka kembalikan pesan bahwa id tidak ditemukan dan hentikan proses
        if (detail == null){
            return res.status(404).json({ massage: "Not Found" });
        }
    }
    catch(e){
        // Jika server error maka kembalikan error dan hentikan proses
        return res.status(500).json({ massage: e.massage });
    }

    // Jika UID ada maka lanjut ke route
    // return detail
    res.detail = detail;
    next();
}

// Routes________________________________________________________________________

// Get all
router.get('/', async (req, res) => {
    try{
        const URLList = await link.find()
        res.json(URLList);
    }
    catch(e){
        res.status(500).json({ massage: e.massage });
    }
});

// Create One
router.post('/', async (req, res) => {
    const newLink = new link({
        UID: crypto.randomBytes(8).toString('base64url'),
        source: req.body.source,
    })
    console.log(newLink);
    try{
        await link.insertOne(newLink);
        res.status(201).json({ massage: `Your shortened link is: ${newLink.UID}` });
    }
    catch(e){
        res.status(400).json({ massage: e.massage });
    }
});

// Get One
router.get('/:UID', getSource, (req, res) => {
    // gunakan res.detail yang dikirim dari middleware
    res.json(res.detail);
});

// Update One (can update one or more element from an object)
router.patch('/:UID', getSource, async(req, res) => {
    console.log("test");
    if(req.body.source != null){
        res.detail.source = req.body.source;
    }
    try{
        await link.updateOne({UID: req.params.UID}, res.detail);
        res.json({ massage: "Updated URL" });
    }
    catch(e){
        res.status(500).json({ massage: e.massage });
    }
});

// Delete One
router.delete('/:UID', getSource, async(req, res) => {
    try{
        await link.deleteOne(res.detail);
        res.json({ massage: "Deleted URL" });
    }
    catch(e){
        res.status(500).json({ massage: e.massage });
    }
});

module.exports = router;