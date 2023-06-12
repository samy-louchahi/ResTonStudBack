const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => { 
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            Identifiant: req.body.Identifiant,
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));   
};
const jwt = require('jsonwebtoken');   
exports.login = (req, res, next) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                userId: user._id,
                token : jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const UserId = jwt.decode(token).userId;
    User.findOne({_id: UserId})
    .then(user => res.status(200).json({
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }))
    .catch(error => res.status(404).json({ error }));
};