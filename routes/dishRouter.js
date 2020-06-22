const express = require('express');

const Dish = require('../models/Dish');

const dishRouter = express.Router();

dishRouter.route('/')
    .get((req, res, next) => {
        Dish.find()
            .then(dishes => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Dish.create(req.body)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
        Dish.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch(err => next(err));
    });


dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
    })
    .put((req, res, next) => {
        Dish.findByIdAndUpdate(req.params.dishId,
            {
                $set: req.body
            }, { new: true })
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Dish.findByIdAndRemove(req.params.dishId)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch(err => next(err));

    });

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error(`Dish ${req.params.dishId} not found`);
                    err.statusCode = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {

        /*
        Dish.findByIdAndUpdate(req.params.dishId, {
            $push: {
                comments: req.body
            }
        }, { new: true });
        */

        Dish.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, err => next(err));
                } else {
                    err = new Error(`Dish ${req.params.dishId} not found`);
                    err.statusCode = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
    })
    .delete((req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    dish.comments.forEach(comment => {
                        dish.comments.id(comment._id).remove();
                    })
                    dish.save()
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, err => next(err));
                } else {
                    err = new Error(`Dish ${req.params.dishId} not found`);
                    err.statusCode = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    });

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                if (dish && dish.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (!dish) {
                    err = new Error(`Dish ${req.params.dishId} not found`);
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.statusCode = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`Post operation not supported on /dishes/${req.params.dishId}
         comments/${req.params.commentId}`);
    })
    .put((req, res, next) => {

        /*
        const updateObj = {};
        const { rating, comment } = req.body;

        if (comment)
            updateObj['comments.$.comment'] = comment;
        if (rating)
            updateObj['comments.$.rating'] = rating;

        Dish.findOneAndUpdate(
            {
                _id: req.params.dishId,
                "comments._id": req.params.commentId
            },
            {
                $set: updateObj
            }, { new: true }).then(dish => {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.json(dish);
            });

        */

        Dish.findById(req.params.dishId)
            .then(dish => {
                if (dish && dish.comments.id(req.params.commentId)) {

                    const { rating, comment } = req.body;

                    if (rating)
                        dish.comments.id(req.params.commentId).rating = rating;
                    if (comment)
                        dish.comments.id(req.params.commentId).comment = comment;

                    dish.save()
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        });

                } else if (!dish) {
                    err = new Error(`Dish ${req.params.dishId} not found`);
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.statusCode = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Dish.findById(req.params.dishId)
            .then(dish => {
                if (dish && dish.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    dish.comments.id(commentId).remove();
                } else if (!dish) {
                    err = new Error(`Dish ${req.params.dishId} not found`);
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.statusCode = 404;
                    return next(err);
                }
            }, err => next(err))
            .catch(err => next(err));
    })


module.exports = dishRouter;
