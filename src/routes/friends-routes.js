const express = require('express')
const router = new express.Router()

const Profile = require('../models/profile')
const Notification = require('../models/notification') // rimuovi
const nh = require('../helper-functions/notification-helpers') // aggiungi funzione notifica addNewFriend, removeFriend, sentFriendRequest

// da testare
// Search users
router.get('/:id/searchUser', (req, res, next) => {
    const { name } = req.query;
    Profile.find({ text: { $search: name } }, { given_name: 1 }).exec().then((profiles) => {
        console.log("Debug found profiles: " + JSON.stringify(profiles));
        res.json(profiles);
    });
});

// da testare
// View friendships
router.get('/:id/friendships', (req, res, next) => {
    if (!req.user_id) { return res.status(401).send('Not authenticated') }
    const id = req.params.id;
    if (!id) {
        return res.status(400).send('Bad Request')
    }
    Profile.findOne({ user_id: id }).exec().then((profile) => {
        if (profile === null) {
            return res.status(404).send('Profiles not found');
        }
        Profile.find({ user_id: { $in: profile.friends_id }}).exec().then((friends)=>{
            res.json(friends);
        });
    });
});

// da testare
// View friendship requests
router.get('/:id/requests', (req, res, next) => {
    if (!req.user_id) { return res.status(401).send('Not authenticated') }
    const id = req.params.id;
    Profile.findOne({ user_id: id }).exec().then((profile) => {
        if (profile === null) {
            return res.status(404).send('Profiles not found')
        }
        res.json(profile.pending_friend_requests_id);
    });
});

// da testare
// Send friendship request
router.post('/:id/addfriend', async (req, res, next) => {
    const id = req.user_id;  //id dell'utente loggato
    if (!id) { return res.status(401).send('Not authenticated') }
    const friend_id = req.params.id;  //id utente a cui voglio inviare richiesta
    Profile.findOne( { user_id: friend_id }).exec().then((profile) => {
        if (profile === null) {
            return res.status(404).send('Friend not found');
        }
        return profile;
    }).then((profile) => {
        if (!profile.friends_id.includes(id) && !profile.pending_friend_requests_id.includes(id) && id !== friend_id) {
            Profile.updateOne( 
                { user_id: friend_id },
                { $push: { pending_friend_requests_id: id } }
            ).exec();
        }
        res.json(profile);
        Profile.findOne({ user_id:id }).then((sender)=>{
            nh.addNewfriend(friend_id, sender, profile);
        });
    })
});

// da testare
// Remove friendship
router.post('/:id/removefriend', (req, res, next) => {
    const id = req.user_id;    //id dell'utente loggato
    console.log(id);
    if (!id) { return res.status(401).send('Not authenticated') }
    const friend_id = req.params.id;  //id utente a cui voglio togliere amicizia
    console.log(friend_id)
    Profile.updateOne(
        { user_id: id, friends_id: friend_id },
        { $pull: { friends_id: friend_id } }
    ).exec();

    Profile.updateOne(
    { user_id: friend_id, friends_id: id },
        { $pull: { friends_id: id } }
    ).exec();
    Profile.findOne({ user_id: friend_id }).then((profile)=>{
        Profile.findOne({ user_id:id }).then((sender)=>{
            nh.removeFriend(friend_id, sender, profile);
        });
    });
    return res.status(200).send();
});

// da testare
// Add friendship
router.post('/:id/acceptrequest', (req, res, next) => {
    console.log("Entrato");
    const id = req.user_id;  //id dell'utente loggato
    if (!id) { return res.status(401).send('Not authenticated') }
    const friend_id = req.params.id;  //id utente a cui voglio accettare richiesta
    console.log('user_id '+ id);
    console.log('friend_id '+ friend_id);
    Profile.findOneAndUpdate(
        { user_id: id, pending_friend_requests_id: friend_id},
        { $pull: { pending_friend_requests_id: friend_id }, $push: { friends_id: friend_id } }
    ).exec().then((profile) => {
        if (profile !== null) {
            Profile.updateOne(
                { user_id: friend_id},
                { $push: {friends_id: id} }
            ).exec();
        }
        Profile.findOne({ user_id:id }).then((sender)=>{
            nh.acceptFriendRequest(friend_id, sender, profile);
        });
    })

    return res.status(200).send();
});

// da testare
// Remove friendship
router.post('/:id/declinerequest', (req, res, next) => {
    console.log("Entrato-refuse");
    const id = req.user_id;
    if (!id) { return res.status(401).send('Not authenticated') }
    const friend_id = req.params.id;
    Profile.findOneAndUpdate(
        { user_id: id, pending_friend_requests_id: friend_id },
        { $pull: { pending_friend_requests_id: friend_id } }
    ).exec();
    Profile.findOne({ user_id: friend_id }).then((profile)=>{
        Profile.findOne({ user_id:id }).then((sender)=>{
            nh.rejectFriendRequest(friend_id, sender, profile);
        });
    });
    return res.status(200).send();
});

module.exports = router;