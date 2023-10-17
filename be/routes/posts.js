// richiedi le varie cose
const express = require('express');
const PostModel = require('../models/post')

// rotta dei post
const posts = express.Router();

const validatePost = require('../middlewares/validatePost')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const crypto = require('crypto');
// importa dati .env (dati nascost)
require('dotenv').config()


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
        // posizione in cui salvare i file
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

// post su pubblic sul locale
posts.post('/posts/post/upload', upload.single('cover') ,async ( req, res ) => {
    
    const url = `${req.protocol}://${req.get('host')}`

    try {
        const imgUrl = req.file.filename;

        res.status(200).json({img: `${url}/pubblic/${imgUrl}`, 
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

// post su cloudinary
posts.post('/posts/post/cloudUpload', cloudUpload.single('cover'), async (req, res) => {
    try {
        const cover = req.file.path; 
        res.status(200).json({ cover });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "errore interno del server",
            error: e
        });
    }
});

// posts.post('/posts/post/cloudUpload', cloudUpload.single('cover'), async(req, res) => {
//     try {
//         res.status(200).json({ cover: req.file.path })
//     } catch (e) {
//         res.status(500).send({
//             statusCode:500,
//             message: "errore interno del server",
//             error: e
//         })
//     }
// })



// get
posts.get('/posts/get', async (req, res) => {

    // dichiaro la quantità di articoli da vedere x pag, poi gestisco la cosa quando faccio la get gestendo il num della pag. volendo posso modificare la pageSize
    const{ page = 1, pageSize = 10} = req.query

    try {

       const posts = await PostModel.find()
            .populate('author')//popola author nell'oggetto
            .limit(pageSize)//limite preso da sopra
            .skip((page -1) * pageSize );//dall'ultima pag salta n.(pageSize) articoli

       const totalPosts = await PostModel.count();//metodo che permette di contare quanti post ci sono

       res.status(200)
        .send({
            statusCode: 200,
            courentPage: Number(page),
            totalPages: Math.ceil(totalPosts / pageSize ),//ceil da numeri interi
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

// get by title
posts.get('/posts/get/bytitle', async (req, res) => {
    const { title } = req.query;

    try {
        const postByTitle = await PostModel.find({
            // Cerca all'interno del campo 'title' utilizzando regex
            title: {
                $regex: new RegExp(title, 'i'), // 'i' indica la corrispondenza senza distinzione tra maiuscole e minuscole
            }
        });

        res.status(200).send(postByTitle);
        
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// get by date
posts.get('/posts/get/:date', async (req, res)=>{
    const { date } = req.params

    try {

        // farà da aggregatore a tutti i post che rispettano questa condizione
        const getPostByDate = await PostModel.aggregate([
            {
                $match: {
                    $expr:{
                        $and:[
                            {
                                $eq: [
                                    { $dayOfMonth: '$createdAt' },
                                    { $dayOfMonth: new Date(date)}
                                ]
                            },
                            {
                                $eq: [
                                    { $month: '$createdAt'},
                                    { $month: new Date(date)}
                                ]
                            },
                            {
                                $eq: [
                                    { $year: '$createdAt'},
                                    { $year: new Date(date)}
                                ]
                            }
                        ]
                    }
                }
            }
        ])
        
        res.status(200).send(getPostByDate)

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
})

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
            message: "This post does not exist!"
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
            message: "post deleted"
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
