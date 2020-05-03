const { dialogflow } = require("actions-on-google") ;

const functions = require('firebase-functions');
//const { DialogflowApp } = require('actions-on-google');
const app = dialogflow({ debug: true });
const {WebhookClient} = require('dialogflow-fulfillment');
//const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');
//const gactions = require('actions-on-google');
const { BasicCard, Button } = require('actions-on-google');
const request = require('request');



process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


    function getData(){
        return axios.get('https://playhacker.com/wp-json/wp/v2/posts?tags=${tag}&_embed');
    }
    function getProjects(agent){
        const api = 'https://playhacker.com/wp-json/wp/v2';
        const tag = agent.parameters.tag;
        //let url = `${api}/posts?tags=${tag}&_embed`;


        let getPosts = (tag, callback) => {
            let url = `${api}/posts?tags=${tag}&_embed`;
            request({url}, (err, res, body) => {
                if (err) {
                    callback('Sorry, there was an error getting posts from our blog', err);
                    return;
                } else {
                    let posts = JSON.parse(body);
                    if (posts.length === 0) {
                        callback(`It doesn't seem like there's any content available on this topic`);
                        return;
                    } else {
                        let formattedPosts = posts.map((post) => {

                            return {
                                "payload": {
                                    "google": {
                                        "expectUserResponse": true,
                                        "richResponse": {
                                            "items": [
                                                {
                                                    "simpleResponse": {
                                                        "textToSpeech": "Here is a project we found for you"
                                                    }
                                                },
                                                {
                                                    "basicCard": {
                                                        "title": post.title.rendered,
                                                        "subtitle": "Project",
                                                        "formattedText": post.excerpt.rendered.replace(/<(?:.|\\n)*?>/gm, '').replace(/&[^\\s]*/, ''),
                                                        "image": {
                                                            "url": post._embedded['wp:featuredmedia'][0].media_details.sizes.listing.source_url,
                                                            "accessibilityText": "featured image"
                                                        },
                                                        "buttons": [
                                                            {
                                                                "title": "Read more",
                                                                "openUrlAction": {
                                                                    "url": post.link
                                                                }
                                                            }
                                                        ],
                                                        "imageDisplayOptions": "CROPPED"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            };
                        });

                        formattedPosts.unshift({
                            type: 0,
                            platform: 'google',
                            speech: 'Sure, here are some helpful projects'
                        });

                        callback(undefined, formattedPosts);
                        return;
                    }
                }
            });
        };


    }

    let intentMap = new Map();

    intentMap.set('getProjects',getProjects);
    agent.handleRequest(intentMap);
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 //exports.helloWorld = functions.https.onRequest((request, response) => {
 //response.send("Hello from Firebase!");
 //});
