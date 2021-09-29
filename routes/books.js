const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const fs = require("fs");

const path = require("path");
const uploadPath = path.join("public",Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jfif"];

const multer = require("multer");
const upload = multer({
    dest: uploadPath,
    // dest: "public/uploads/bookCovers",
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

//All Books Route
router.get("/", async (req, res)=>{
    let query = Book.find();
    if (req.query.title != null && req.query.title != " "){
        query = query.regex("title", new RegExp(req.query.title, "i"));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != " "){
        query = query.lte("publishDate", req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != " "){
        query = query.gte("publishDate", req.query.publishedAfter);
    }
    
    try{
        const books = await query.exec();
        res.render("books/index",{
            books: books,
            searchOptions: req.query
        });
    } catch{
        res.redirect("/");
    }
    
});

//New Book Route
router.get("/new", async (req, res)=>{
    renderNewPage(res, new Book());
});

//Create Book Route
router.post("/", upload.single("cover"), async (req, res)=>{
    const fileName = (req.file != null ? req.file.filename : null);
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        author: req.body.author      
    });
    try {
        const newBook = await book.save();
        // res.redirect(`books/${newbook.id}`);
        res.redirect("books");
    } catch(error){
        if (book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, error.message);
    }
});

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => { 
        if(err){
            console.error(err);
        }
     });
}

async function renderNewPage(res, book, errorMsg=null) {
    try{
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (errorMsg != null) {
            params.errorMessage = ("Book Save Failed! " + errorMsg);
        }
        res.render("books/new", params);
    } catch{
        res.redirect("/books");
    }  
}

module.exports = router;