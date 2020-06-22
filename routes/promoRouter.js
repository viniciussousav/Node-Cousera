const express = require('express');

const Promotions = require('../models/promotions');

const promoteRouter = express.Router();

promoteRouter.route('/')
    .get((req, res, next) => {
        Promotions.find()
            .then(promos => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Promotions.create(req.body)
            .then(promo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo)
            }, err => next(err))
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        Promotions.remove()
            .then(promos => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            }, err => next(err))
            .catch(err => next(err));
    });


promoteRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(promo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promoId}`);
    })
    .put((req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId,
            {
                $set: req.body
            }, { new: true })
            .then(promo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, err => next(err))
            .catch(err = next(err));
    })
    .delete((req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then(promo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = promoteRouter;
