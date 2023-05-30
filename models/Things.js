const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    name: { type: String, required: true },
    ville: { type: String, required: true },
    cover: { binData: Buffer , type: String, required: true},
    userId: { type: String, required: true },
    ArtisteCollab : {
        name: { type: String, required: true },
        url: { type: String, required: true },
    }
});

module.exports = mongoose.model('Thing', thingSchema);