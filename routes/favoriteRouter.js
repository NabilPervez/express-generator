const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Campsite.find({ user: req.user._id })
    .populate(req.params.user)
    .populate(req.params.campsites)
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    
    favorite.findOne({user: req.user._id})
        .then(favorite => {
            if(favorite){
                req.body.forEach( (fav) => {
                    if(!favorite.campsites.includes(fav._id)){
                        favorite.campsites.push(fav._id);
                    }
                })
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            }
        }).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`operation not supported`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete(req.params._id) //might change arg
    // incomplete - return to this
    .then(favorite => {
        if (favorite){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        }
        else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`operation not supported`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    // look for fav
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if(favorite){
            if(!favorite.campsites.includes(req.params.campsiteId)){
                favorite.campsite.push(req.params.campsiteId)
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));                
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You do not have any favorites to delete.');
            }
    }else{
        favorite.create({user: req.user._id, campsites: [req.params.campsiteId]})
        .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        .catch(err => next(err));
    }}).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`operation not supported`);
})
delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const campsiteIndex = favorite.campsites.indexOf(
            req.params.campsiteId
          );
          if (campsiteIndex >= 0) {
            favorite.campsites.splice(campsiteIndex, 1);
          }
          favorite
            .save()
            .then((favorite) => {
              console.log("Favorite Campsites has been Deleted!", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You do have any favorites to delete");
        }
      })
      .catch((err) => next(err));
    });

module.exports = favoriteRouter;