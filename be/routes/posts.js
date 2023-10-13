const express = require('express');
const PostModel = require('../models/post')
const posts = express.Router();
const validatePost = require('../middlewares/validatePost')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()
const crypto = require('crypto');
const { json } = require('body-parser');


cloudinary.config({
    cloud_name: process.env.CLAUDINARY_CLOUD_NAME,
    api_key: process.env.CLAUDINARY_API_KEY,
    api_secret: process.env.CLAUDINARY_API_SECRET
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'coverImages',
        format: async (req, file) => 'png',
        pubblic_id: (req, file) => file.name
    }
})

const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'pubblic')
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`
        const fileExtension = file.originalname.split('.').pop()
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)

    }
})

const upload = multer({ storage: internalStorage })
const cloudUpload = multer({ storage: cloudStorage })

posts.post('/posts/post/upload', upload.single('cover') ,async ( req, res ) => {
    
    const url = `${req.protocol}://${req.get('host')}`

    try {
        const imgUrl = req.file.filename;

        res.status(200).send({img: `${url}/pubblic/${imgUrl}`, 
            statusCode: 200,
            message: "file caricato con successo",
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
})

posts.post('/posts/post/cloudUpload', cloudUpload.single('cover'), async(req, res) => {
    try {
        res.status(200).json({ cover: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
})





// get
posts.get('/posts/get', async (req, res) => {

    const{ page = 1, pageSize = 10} = req.query

    try {
       const posts = await PostModel.find()
            .populate('author')
            .limit(pageSize)
            .skip((page -1) * pageSize );

       const totalPosts = await PostModel.count();

       res.status(200)
        .send({
            statusCode: 200,
            courentPage: Number(page),
            totalPages: Math.ceil(totalPosts / pageSize ),
            totalPosts,
            posts
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
});


// get by Id
posts.get('/posts/get/:postId' , async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post non trovato!"
            });
        }

        res.status(200).send({
            statusCode: 200,
            post
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});


// post
posts.post('/posts/post', validatePost, async (req, res)=>{

    const newPost = new PostModel({
        title: req.body.title,
        category: req.body.category,

        cover: req.body.cover,
        readTime: {
            value: Number(req.body.readTime.value),
            unit: req.body.readTime.unit
        },
        content: req.body.rate,
        // author: {
        //     name: req.body.author.name,
        //     avatar: req.body.author.avatar
        // },
        author: req.body.author
    })

    try {
        const post = await newPost.save()

        res.status(200).send({
            statusCode: 200,
            message: "post salvato con successo",
            payload: post,
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
});


// put
posts.put('/posts/put/:postId', async (req, res)=>{
    const { postId } = req.params;

    const postExist = await PostModel.findById(postId)

    if (!postExist){
        return res.status(404).send({
            statusCode: 404,
            message: "this post does not exist!"
        })
    }

    try {
        const dataToUpdate = req.body;
        const options = { new: true };
        const result = await PostModel.findByIdAndUpdate( postId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post saved successfully",
            result 
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
});


// delete
posts.delete('/posts/delete/:postId', async (req, res)=>{
    const { postId } = req.params;

    try {
        const post = await PostModel.findByIdAndDelete(postId);

        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "post cancellato"
        })
    } catch (e) {
        res.status(500).send({
            statusCode:500,
            message: "errore interno del server",
            error: e
        })
    }
})



module.exports = posts;
