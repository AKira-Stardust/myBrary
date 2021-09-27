const express = require("express");
const router = express.Router();

//Route for Index page
router.get('/', (req, res)=>{
    // res.send("Hello World!");
    res.render("index");
});

//Export Router
module.exports = router;