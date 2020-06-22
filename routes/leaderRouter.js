const express = require('express');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find()
            .then(leaders => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Leaders.create(req.body)
            .then(leaders => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, err => next(err))
            .catch(err => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        Leaders.remove()
            .then(leaders => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, err => next(err))
            .catch(err => next(err));
    });


leaderRouter.route('/:leaderId')
    .get((req, res) => {
        Leaders.findById(req.params.leaderId)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
    })
    .put((req, res) => {
        Leaders.findByIdAndUpdate(req.params.leaderId,
            {
                $set: req.body
            }, { new: true })
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete((req, res) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then(leader => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, err => next(err))
        .catch(err => next(err));
    });

module.exports = leaderRouter;
