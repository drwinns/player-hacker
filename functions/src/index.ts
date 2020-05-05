import { https } from 'firebase-functions';
import { WebhookClient } from 'dialogflow-fulfillment';
import { Suggestions, BasicCard, Button, Image, LinkOutSuggestion, BrowseCarousel, BrowseCarouselItem } from 'actions-on-google'

import { ServerClient } from "postmark";
import axios from 'axios';
import { init, agent as agentHelper, entityEntryInterface } from 'dialogflow-helper';

init({
    "client_email": " dialogflow-binwjd@apologetic-robot-fiajxe.iam.gserviceaccount.com",
    "project_id": "apologetic-robot-fiajxe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDN5RmwlHj8NJVK\npCgVTojIMDB+IvNHXmAHZp6Zl/4qAF4lky9ntAHK7VCWL1/kh4Oou01TXkzPvUGQ\nSyE/u0a/BWSosXS7lgxNAmLhqqtPhFzOO6iFR7ZVWfdgjh7pBe4LbIEdLTAr1179\nvlwq96Vuc0qR5+kt17uPiu72GnpitJrxZsasjyTYl9PP0c/aUIjnIVFgyjrLAQkZ\ncDmZAmDlL9gzGSb2bSTzf0w6zfm/1MuBzCSF3uYK82y2XhcJOXyIadaul/BbdPZP\nb1Z/BOjZzt+9JqQGvsfOJ13Uk3B/UujaC9BrWajmzn/cXi/68w13RYF7prswH2E8\nTxLiW3H5AgMBAAECggEABz0Gqi6OEk/G79jVj+oy5NbM3aJc6yVmOtxgtwWg6dkZ\ndji2ce7iIUA2lREVTfN1rXjoPwYRrTv6EhiSEquC0TRfVY7ni7C6vfpXf5eAbks4\n+Acg5Y6f2mBPUhWtAIQ02jH2WBA+oUvxCvqmQtxx9HAZLwf4KqRq86DuxbgolU+z\n8Vd5jSTdhkSbL3J5ECtpiyXqx5+wgwhT4ryhEqhNYD0iNR7Wi3mSu/TuRcilokTj\nGQLv8ypd8D3EMyAAqBsKfjHsgP2M0GciQDOk3Fei1sGwdtP3uOOqMTJ2G/j2fFes\nn/ziHHJMoEzopiwsY++yMN4Fut0zXBN31di03H2AAQKBgQD4eFrpgRm62UDsRDvm\ncp1sIZzACJoh2lz3KbGKtgszjmDHf7+ojHBAJCRlsB1dRLeQNdvmZZ8EsYmLep1x\nQho3EV9/+goQ+aAHGBpoyPoR/CRRNJr9HC/Y1dTNBqBkYVN/vcqZrqCRsBQ79qE3\nncpqlP9srDGKDa+zQOwDwpd7kQKBgQDUInHDxIYBpja+NLwTxzPPmSIhniK/v6ii\nfCHQvl5I1aQgczvA0t0XwEf8dl2QmfH3+X14HVNQK6sqBfPIbrYX/oy0moxWuIEV\ngx8IYRknC2KksrhB7qBebgcWT9SNTjO/XsD7CK1qewBhxvroWgm7tc48tj5HNwLM\n8nAXb4DL6QKBgQC12H/QvWdzVGUrhZTBR8jmxoLOGH2VoRbA3YbOmgUAqocx+tDu\nLjpI9yqcMZSMGiquJHzX1i/XY4fiyM5JgbNl8hUOuJR9b/QqvP03Cz/ZwctikzmL\nXQG3lGe11c+1J3XQ27pXV3K0rUVhzVKYPadS8dEuW6e1/eZFLpKM/fGXwQKBgC1g\nrNtGt6+0oXMwjqbgbsnSpQVx8Vb5JZaUXRttDXghEznJzJdjw92nyP5NR5h+Bc+Y\ns+k0xLSaksOrgEl4vUUGs4ySnsCSOTKj2MiPFLVQbypx/I5GAFIS0TtJmlsbxmAC\nYd+RLJ9hbmR8DwIS+JAJxPMhvNK5BsVWevnYZUG5AoGAVxZPy+hlJys8I0tgPNXe\n+F//yCGV0HSZw7/gLRWxdhQtsnOZoGspuU7EwuMQGTXtMjfhYtADQ2vaA5tsR0Uz\nE+QdjhZ8/buAPQ1xbyzQ8WOVs75umWRu0vxKw5WlEEMN8hWeRuVs1jxsUFVeYkh+\n3uM/gSu71VHH6cy5Z4d50y4=\n-----END PRIVATE KEY-----\n",
})

export const webhook = https.onRequest(async (request, response) => {
    try {

        const _agent = new WebhookClient({ request, response });
        console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        console.log('Dialogflow Request body: ' + JSON.stringify(request.body));




        async function getProduct(agent: WebhookClient) {

            console.log("this is get getProduct intent");
            (agent.requestSource as any) = "ACTIONS_ON_GOOGLE";
            const conv = agent.conv();

            const Product = agent.parameters.Product;
            let products: any[];
            const items: BrowseCarouselItem[] = [];

            if (!Product) {
                conv.ask("What product are you looking for?");

                await agentHelper.getEntity("fc689e87-a9fc-4749-8d81-ee1dff6583c8").then((entity: any) => {
                    console.log("received entity: ", entity.name);
                    const entities: entityEntryInterface[] = entity.entities;

                    conv.ask(new Suggestions(
                        pluck(entities).synonyms[0],
                        pluck(entities).synonyms[0],
                        pluck(entities).synonyms[0],
                    ))
                    agent.add(conv);
                    return;
                }).catch(e => {
                    console.log("error in getting entity: ", e);
                    agent.add(conv);
                })
            } else {

                await Promise.all([
                    axios.get("https://playhacker.com/wp-json/wc/v3/products?per_page=100&page=1", {
                        headers: {
                            'Authorization': 'Basic Y2tfOTdkNGZmZTJhMmEwNTFhNTBiNmQyY2ZmNWQzOTA2ZDE5MGU3ZjhiODpjc185ZTA2Yjg2YzIxYzJmOTA4YjQ2NTI2NjA2NDUxYTNiOTlhMzQ3ODc1',
                            'Cookie': 'guest_user=d3d1d697d983ff5d905ddcd3d9bac3e5'
                        }
                    }),
                    axios.get("https://playhacker.com/wp-json/wc/v3/products?per_page=100&page=2", {
                        headers: {
                            'Authorization': 'Basic Y2tfOTdkNGZmZTJhMmEwNTFhNTBiNmQyY2ZmNWQzOTA2ZDE5MGU3ZjhiODpjc185ZTA2Yjg2YzIxYzJmOTA4YjQ2NTI2NjA2NDUxYTNiOTlhMzQ3ODc1',
                            'Cookie': 'guest_user=d3d1d697d983ff5d905ddcd3d9bac3e5'
                        }
                    })
                ])
                    .then(function (res) {
                        products = [].concat(res[0].data, res[1].data);

                        console.log("received product count: ", products.length);
                        console.log("first product name: ", products[0].name);


                        console.log("user said product: ", Product);

                        // short listing products
                        products.map((eachProduct: any) => {
                            // console.log("eachProduct: ", eachProduct);
                            eachProduct.attributes.map((eachAttribute: { name: string, options: string[] }) => {
                                if (eachAttribute.name === "usedfor"
                                    && eachAttribute.options.some(x => x.toLowerCase() === Product.toLowerCase())) {

                                    items.push(new BrowseCarouselItem({
                                        title: eachProduct.name,
                                        url: eachProduct.permalink,
                                        // subtitle: 'This is a subtitle',
                                        description: eachProduct.short_description,
                                        image: new Image({
                                            url: eachProduct.images[0].src,
                                            alt: "Image of " + eachProduct.name
                                        }),
                                        // footer: "This is footer"
                                    }))
                                }
                            })
                        });

                        if (items.length) {

                            conv.ask(`You might be looking for these products: `);

                            conv.ask(new BrowseCarousel({ items: items }))
                            // conv.ask(new Suggestions(`I need a different product`))
                            agent.add(conv)
                            return;

                        } else {
                            conv.ask("Search " + Product + " on Play Hacker");
                            conv.ask(
                                new BasicCard({
                                    buttons: [
                                        new Button({ title: `Search ${Product} `, url: 'https://app.searchie.io/widget/yJe1BjV1ak#/search/' + Product })
                                    ],
                                    title: 'Search Product',
                                    image: new Image({
                                        url:
                                            'https://playhacker.com/wp-content/uploads/2019/06/search-circle.png',
                                        alt: 'search image'
                                    }),
                                    // subtitle: 'Test subtitle',
                                    // text: 'Test text'
                                })
                            );
                            agent.add(conv);
                            return;
                        }

                    }).catch(e => {
                        console.log("error in getting data from woocommerece api: ", e);
                        agent.add("sorry I am currently unavailable, please try again later");
                        return
                    })

            }

        }


        async function getPosts(agent: WebhookClient) {

            (agent.requestSource as any) = "ACTIONS_ON_GOOGLE";
            const conv = agent.conv();
            const tag = agent.parameters.tag;
            //let prosts: any[];
            const items: BrowseCarouselItem[] = [];

            await Promise.all([
                axios.get(`https://playhacker.com/wp-json/wp/v2/posts?tags=${tag}&_embed`),

            ])

                .then(function (res) {
                    const posts = [].concat(res[0].data, res[1].data);

                    agent.add(`I have got ${posts.length} posts:\n`);

                    posts.map((eachPost: any) => {
                        //agent.add(`${eachPost.id}: ${eachPost.name}\n`);
                        items.push(new BrowseCarouselItem({
                            title: eachPost.title.rendered,
                            url: eachPost.link,
                            // subtitle: 'This is a subtitle',
                            description: eachPost.excerpt.rendered.replace(/<(?:.|\\n)*?>/gm, '').replace(/&[^\\s]*/, ''),
                            image: new Image({
                                url: eachPost._embedded['wp:featuredmedia'][0].media_details.sizes.listing.source_url,
                                alt: "Image of " + eachPost.title
                            }),
                            // footer: "This is footer"
                        }))
                    });
                    if (items.length) {

                        conv.ask(`I have found you these posts: `);

                        conv.ask(new BrowseCarousel({ items: items }))
                        agent.add(conv)
                        return;

                    }else {
                        conv.ask("I could not find posts about " + tag + " on Play Hacker");
                        agent.add(conv)
                        return;
                    }
                    return;
                }).catch(console.log)
        }


        async function getProductInfo(agent: WebhookClient) {
            console.log("this is get product intent");
            (agent.requestSource as any) = "ACTIONS_ON_GOOGLE";
            const conv = agent.conv();


            const productName = parseInt(agent.parameters.productName);
            let products: any[];


            // getting data from woocommerece 
            await Promise.all([
                axios.get("https://playhacker.com/wp-json/wc/v3/products?per_page=100&page=1", {
                    headers: {
                        'Authorization': 'Basic Y2tfOTdkNGZmZTJhMmEwNTFhNTBiNmQyY2ZmNWQzOTA2ZDE5MGU3ZjhiODpjc185ZTA2Yjg2YzIxYzJmOTA4YjQ2NTI2NjA2NDUxYTNiOTlhMzQ3ODc1',
                        'Cookie': 'guest_user=d3d1d697d983ff5d905ddcd3d9bac3e5'
                    }
                }),
                axios.get("https://playhacker.com/wp-json/wc/v3/products?per_page=100&page=2", {
                    headers: {
                        'Authorization': 'Basic Y2tfOTdkNGZmZTJhMmEwNTFhNTBiNmQyY2ZmNWQzOTA2ZDE5MGU3ZjhiODpjc185ZTA2Yjg2YzIxYzJmOTA4YjQ2NTI2NjA2NDUxYTNiOTlhMzQ3ODc1',
                        'Cookie': 'guest_user=d3d1d697d983ff5d905ddcd3d9bac3e5'
                    }
                })
            ])
                .then(function (res) {
                    products = [].concat(res[0].data, res[1].data);

                    console.log("received product count: ", products.length);
                    console.log("first product name: ", products[0].name);

                    if (!productName) {

                        conv.ask("which products would you like to know about");
                        conv.ask(new Suggestions(pluck(products).name))
                        conv.ask(new Suggestions(pluck(products).name))
                        conv.ask(new Suggestions(pluck(products).name))
                        agent.add(conv);

                        return;

                    } else {

                        console.log("user said product number: ", productName);

                        products.map((eachProduct: any) => {
                            // console.log("eachProduct: ", eachProduct);

                            if (parseInt(eachProduct.id) === productName) {
                                conv.ask(`This might be what you are looking for. Here are the details for ${eachProduct.name}.`);

                                conv.ask(
                                    new BasicCard({
                                        title: eachProduct.name,
                                        // subtitle: 'This is a subtitle',
                                        text: eachProduct.short_description,
                                        image: new Image({
                                            url: eachProduct.images[0].src,
                                            alt: "Image of " + eachProduct.name
                                        }),
                                        buttons: [
                                            new Button({ title: "Learn More", url: eachProduct.permalink }),
                                            //new Button({ title: 'Test Button 2', url: 'https://botcopy.com' })
                                        ],
                                    })
                                );
                                conv.ask(
                                    new LinkOutSuggestion({
                                        name: eachProduct.ButtonText || "Learn More (new tab)",
                                        url: eachProduct.permalink
                                    })
                                );
                                // conv.ask(new Suggestions("Get other product info"));
                                // conv.ask(new Suggestions("Show details of " + pluck(products).name))
                                // agent.add(conv);

                                return;
                            }
                        });

                    }

                }).catch(e => {
                    console.log("error in getting data from woocommerece api: ", e);
                    agent.add("sorry I am currently unavailable, please try again later");
                    return
                })
        }

        function CaptureUserInfo(agent: WebhookClient) {
            console.log("agent.parameters: ", agent.parameters);
            const {
                firstname, lastname, email, mobilephone
            } = agent.parameters;

            const data = [{
                firstname: firstname,
                lastname: lastname,
                Email: email,
                mobilephone: mobilephone
            }];
            axios.post('https://sheet.best/api/sheets/36020baa-fccb-4667-af52-90759d44e976', data).catch(e => {
                console.log("error in saving data: ", e)
            })
        }

        async function getEmail(agent: WebhookClient) {

            console.log("GetEmail agent.parameters: ", agent.parameters);
            console.log("user said: ", agent.query);


            if (!agent.parameters.email) {
                agent.add("please tell me your email, I will forward it to human support agent and he will get in touch with you as soon as possible");
            } else if (!agent.parameters.question) { // slot filling for every parameter is not in use
                agent.add(`please re-phrase your question so I will forward your question along with your email too`);
            } else {

                // const serverTokenDev = "0cb9fc14-bdcb-4616-9be7-fa501b6c39a9";
                const serverToken = "28733ad7-6334-445d-a62d-2fe47612608b";
                const client = new ServerClient(serverToken);

                await client.sendEmail({
                    "ReplyTo": agent.parameters.email,
                    "From": "info@sysborg.com",
                    "To": "gist-edcclxgk@inbound.gistmail1.com",
                    "Subject": "email Support request",
                    "TextBody": `Hey,
            I was trying to talk with chatbot on https://playhacker.com/test-bot/ but I didn't get my problem solved
            My Email: ${agent.parameters.email}
            My Question: "${agent.query}"
            
            thanks`

                })
                    .then((sendingResponse) => {
                        console.log("sending response: ", sendingResponse);
                        agent.add(`Awesome. your email noted as ${agent.parameters.email} We will be in touch soon regarding your question: "${agent.query}".`);
                        return;
                    })
                    .catch(e => {
                        console.log("unable to send email.error: ", e);
                        agent.add("unable to send email postmark is under review");
                        return;
                    });
            }
        }

        const intentMap = new Map();

        intentMap.set('GetEmail', getEmail);
        intentMap.set('getProductInfo', getProductInfo);
        intentMap.set('getProduct', getProduct);

        intentMap.set('CaptureUserInfo', CaptureUserInfo);
        intentMap.set('getPosts', getPosts);

        // tslint:disable-next-line: no-floating-promises
        _agent.handleRequest(intentMap);
    } catch (e) {
        console.log("main error catch: ", e);
    }
});





export function pluck<T>(arr: Array<T>): T {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
}
