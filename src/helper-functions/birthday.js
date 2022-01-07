let today = new Date();
today.setHours(1, 0, 0, 0);
let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const Child = require('../models/profile');
const Parent = require('../models/parent');
const Notification = require('../models/notification');
const User = require('../models/user');

setInterval(() => {
    let day = today.getDay();
    let month = today.getMonth();
    Parent.find().then(parents => {
        parents.forEach((parent)=>{
            console.log(parent);
            Child.find({ child_id: parent.child_id }).then((child)=>{
                
            });
        });
    });

    today = tomorrow;
    let newtomorrow = new Date(today);
    newtomorrow.setDate(newtomorrow.getDate() + 1);
    tomorrow = newtomorrow;
}, tomorrow - today);