const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        imagem: {
            type: String,
            required: true
        },
        designation: {
            type: String, 
            required: true
        },
        abbr: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    });

const LeaderModel = mongoose.model('Leader', leaderSchema);

module.exports = LeaderModel;