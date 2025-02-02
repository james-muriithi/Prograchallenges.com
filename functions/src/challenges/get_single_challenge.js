const functions = require('firebase-functions')
const admin = require('firebase-admin')

const getPublishableChallenge = require('./helpers/get_publishable_challenge').default;

const getSingleChallenge = functions.https.onCall(async (data) => {
    let challenge = {};
    let comments = [];
    // actual document of the challenge
    challenge = (await admin.firestore().collection('challenges').doc(data.id).get()).data();

    // challenge comments
    const querySnapshot = await admin.firestore().collection('comments').where('challengeId', '==', data.id).get();
    querySnapshot.forEach((doc) => {
        comments.push(doc.data());
    });
    
    return {
        ...getPublishableChallenge(challenge), 
        comments, // TODO: make comments publishable too
    };
});

module.exports = getSingleChallenge;