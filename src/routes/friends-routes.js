const express = require('express')
const router = new express.Router()

const Profile = require('../models/profile')

// Search users
router.get('/search', (req, res, next) => {
    const { name } = req.query;
    Profile.find({ text: { $search: name } }, { given_name: 1 }).exec().then((profiles) => {
        console.log("Debug found profiles: " + JSON.stringify(profiles));
        res.json(profiles);
    });
});

// View friendships
router.get('/friendships', (req, res, next) => {
    if (!req.user_id) { return res.status(401).send('Not authenticated') }
    const { id } = req.query;
    if (!id) {
        return res.status(400).send('Bad Request')
    }
    Profile.findOne({ user_id: { $in: id } }).exec().then((profile) => {
        if (profile === null) {
            return res.status(404).send('Profiles not found')
        }
        res.json(profile.friends_id);
    });
});

// View friendship requests
router.get('/requests', (req, res, next) => {
    if (!req.user_id) { return res.status(401).send('Not authenticated') }
    const { id } = req.query;
    if (!id) {
        return res.status(400).send('Bad Request')
    }
    Profile.findOne({ user_id: { $in: id } }).exec().then((profile) => {
        if (profile === null) {
            return res.status(404).send('Profiles not found')
        }
        res.json(profile.pending_friend_requests_id);
    });
});

// Send friendship request
router.post('/addfriend', (req, res, next) => {
    const id = req.user_id;
    if (!id) { return res.status(401).send('Not authenticated') }
    const friend_id = req.friend_id;
    Profile.findOne( { user_id: friend_id }).exec().then((profile) => {
        if (profile === null) {
            return res.status(404).send('Friend not found')
        }
        return profile;
    }).done((profile) => {
        if (!profile.friends_id.inclue(id) && !profile.pending_friend_requests_id.inclue(id)) {
            Profile.updateOne( 
                { user_id: profile.friends_id },
                { $push: { pending_friend_requests_id: id } }
            );
        }
    })
});

// Remove friendship
router.post('/removefriend', (req, res, next) => {
    const id = req.user_id;
    if (!id) { return res.status(401).send('Not authenticated') }
    const friend_id = req.friend_id;
    Profile.findOneAndUpdate(
        { user_id: user_id ,
        friends_id: { $elemMatch: friend_id } },
        { $pull: { friends_id: friend_id } }
    )
});

// Add friendship
router.post('/acceptrequest', (req, res, next) => {

});

// Remove friendship
router.post('/declinerequest', (req, res, next) => {

});



module.exports = router;