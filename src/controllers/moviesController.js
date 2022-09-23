const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");


//Aqui tienen una forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;




const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll(
            {order : ["name"]}
        )
        .then(allGenres => {
            return res.render("moviesAdd",{allGenres})
        }).catch(error => console.log(error))
    },
    create: function (req,res) {
        const {title,rating,awards,length,genre_id,release_date}= req.body
    Movies.create({
        title : title.trim(),
        rating,
        awards,
        length,
        genre_id,
        release_date,  
    }).then(movie =>{
     
        return res.redirect("/movies")
    }).catch(error => console.log(error))

    },
    edit: function(req,res) {
        let Movie = Movies.findByPk(req.params.id,{
            include : [
              
                 "genre"
              
            ]
        });
        let allGenres = Genres.findAll({
            order :["name"]
        });
        Promise.all([Movie,allGenres])
        .then(([Movie,allGenres])=>{
        
           return res.render("moviesEdit",{
            Movie,
            allGenres,
            moment 
           })
        }).catch(error => console.log(error))
    },
    update: function (req,res) {
        const {title,rating,awards,length,genre_id,release_date}= req.body
        Movies.update(
            {
                title : title.trim(),
                rating,
                length,
                awards,
                release_date,
                genre_id, 
            },
            {
                where : {
                    id : req.params.id
                }
            }
        ).then( () => res.redirect("/movies/detail/" + req.params.id))
        .catch(error => console.log(error))
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id).then((Movie) => {
            res.render("moviesDelete.ejs", { Movie });
          });
    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where: { id: req.params.id },
          });
          res.redirect("/movies");
    }
}

module.exports = moviesController;