const Thing = require('../models/Things');
const fs = require('fs');

exports.createThing = (req, res, next) => {
  console.info(req.files);
  const coverFile = req.cover;
  coverFile.mv(`${__dirname}/public/images/${coverFile.name}`, function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
  const thingObject = req.body;
  const userId = req.auth.userId;
  const thing = new Thing({
      name : thingObject.name,
      ville : thingObject.ville,
      userId : userId,
      ArtisteCollab : { name : thingObject.ArtisteCollabName, url : thingObject.ArtisteCollabUrl },
      cover: `${__dirname}/public/images/${coverFile.name}`
  });
  thing.save()
  .then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({
      _id: req.params.id
    }).then(
      (thing) => {
        res.status(200).json(thing);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifyThing = (req, res, next) => {
   const thingObject = req.file ?{
        ...JSON.parse(req.body.thing),
        cover: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if(thing.userId !== req.auth.userId){
                res.status(401).json({error: 'Unauthorized request'});
            }else{
                Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Thing updated successfully'}))
                .catch((error) => res.status(401).json({error}));
            }
        })
  };
  
  exports.deleteThing = (req, res, next) => {
   Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if(thing.userId !== req.auth.userId){
                res.status(401).json({error: 'Unauthorized request'});
            }else{
                const filename = thing.cover.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Thing deleted successfully'}))
                    .catch((error) => res.status(401).json({error}));
                });
            }
        })
  };
  
  exports.getAllStuff = (req, res, next) => {
    Thing.find()
    .then(
      (things) => {
        res.status(200).json(things);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
    