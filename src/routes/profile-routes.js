const express = require('express')
const router = new express.Router()

const Profile = require('../models/profile')
const Image = require('../models/image')


router.get('/', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const searchBy = req.query.searchBy
  switch (searchBy) {
    case 'ids':
      const { ids } = req.query
      if (!ids) {
        return res.status(400).send('Bad Request')
      }
      Profile.find({ user_id: { $in: ids } })
        .populate('image')
        .lean()
        .exec()
        .then(profiles => {
          if (profiles.length === 0) {
            return res.status(404).send('Profiles not found')
          }
          for (const profile of profiles) {
            if (profile.image === null) {
              Image.create({
                owner_id: profile.user_id,
                image_id: profile.image_id,
                thumbnail_path: '/images/profiles/user_default_photo.png',
                owner_type: 'user',
                path: '/images/profiles/user_default_photo.png'
              })
              profile.image = {
                thumbnail_path: '/images/profiles/user_default_photo.png',
                path: '/images/profiles/user_default_photo.png'
              }
            }
          }
          res.json(profiles)
        }).catch(next)
      break
    case 'visibility':
      const { visible } = req.query
      if (!visible) {
        return res.status(400).send('Bad Request')
      }
      Profile.find({ visible, suspended: false })
        .populate('image')
        .sort({ given_name: 1, family_name: 1 })
        .lean()
        .exec()
        .then(profiles => {
          if (profiles.length === 0) {
            return res.status(404).send('Profiles not found')
          }
          for (const profile of profiles) {
            if (profile.image === null) {
              Image.create({
                owner_id: profile.user_id,
                image_id: profile.image_id,
                thumbnail_path: '/images/profiles/user_default_photo.png',
                owner_type: 'user',
                path: '/images/profiles/user_default_photo.png'
              })
              profile.image = {
                thumbnail_path: '/images/profiles/user_default_photo.png',
                path: '/images/profiles/user_default_photo.png'
              }
            }
          }
          res.json(profiles)
        }).catch(next)
      break
    default:
      res.status(400).send('Bad Request')
  }
});

router.post('/covidstate', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const id = req.user_id;
  if (!id) {
    return res.status(400).send('Bad Request')
  }
  let covidstate = req.body.covidstate;
  Profile.findOne({ user_id: id }).exec().then((profile) => {
    if (profile === null) {
      return res.status(404).send('Profiles not found')
    }
    profile.covid_state = covidstate;
    Profile.updateOne({ user_id: id }, profile);
    res.json(profile);
  });
});

module.exports = router
