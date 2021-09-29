const express = require("express");
const router = express.Router();
const Book = require("../models/book");

//Route for Index page
router.get('/', async (req, res)=>{
    let books; 
    try{
        books = await Book.find().sort({ createdAtDate: 'desc'}).limit(10).exec();
    } catch {
        books = []; 
    }
    res.render("index", {
        books: books,

    });
});

//Export Router
module.exports = router;