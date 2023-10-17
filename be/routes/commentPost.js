// richiedi le varie cose
const express = require('express');
const CommentModel = require('../models/comment')
// rotta dei commenti
const comment = express.Router();

const validateComment = require('../middlewares/validateComment')
// importa dati .env (dati nascost)
require('dotenv').config()

// get
comment.get('/comment/get', async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('author')

        res.status(200).send({
            statusCode: 200,
            comments
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server",
            error: e
        });
    }
});

// put
comment.put('/comment/put/:commentId', async (req, res) => {
    const { commentId } = req.params;

    // Controlla se il post esiste
    const commentExist = await CommentModel.findById(commentId);

    if (!commentExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This comment does not exist!"
        });
    }

    try {
        const dataToUpdate = req.body;
        const options = { new: true };
        const result = await CommentModel.findByIdAndUpdate( commentId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post saved successfully",
            result 
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: e
        });
    }
});

// post
comment.post('/posts/:postId/comment/post', validateComment, async (req, res) => {
    
    const { postId } = req.params;

    const newComment = new CommentModel({
        comment: req.body.comment,
        postId: postId,
        author: req.body.author
    });

    try {

        const comment = await newComment.save();

        res.status(200).send({
            statusCode: 200,
            message: "Comment added successfully",
            payload: comment
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: e
        });
    }
});

// delete
comment.delete('/comment/delete/:commentId', async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await CommentModel.findByIdAndDelete(commentId);

        if(!comment){

            return res.status(404).send({
                statusCode: 404,
                message: "Comment not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "comment deleted"
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: e
        });
    }
})


module.exports = comment;
