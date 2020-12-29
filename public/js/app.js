console.log('Client side javascript file is loaded!')

//we use the Fetch API to make server requests (to JSON endpoint) from client side scripts using async and Ajax techniques. Fetch is  part of JS living standards (no specific version
// and features are available in Browsers as soon as they are implemented and do not need to wait to implement all features of a specific ECMA version)
//we can also use Axios library (in client side) instead of Fetch which enable the advantages described here:https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5#:~:text=Axios%20is%20a%20Javascript%20library,automatic%20transforms%20of%20JSON%20data.

//in this example using Fetch API , we make a request to a json endpoints and instead of returning a HTML blob from the server (from app.js Node file), now you return JSON, and Fetch
// will read JSON on client and allow to display the JSON values returned on the page. Compared with HBS which replaces the params passed by app.js Node file on server side
//before rendering the page. the advantage of the former architecture is that the JSON returned can be used by several rendering devices (Browser, mobile Apps...)
const form = document.querySelector('form');
const searchButton = document.querySelector('input');
const msg1 = document.querySelector('#message-1');
const msg2 = document.querySelector('#message-2');
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    msg1.textContent = 'Loading...';
    msg2.textContent = '';
    // fetch('http://localhost:3000/weather?address='+searchButton.value).then((response)=>{
    //     response.json().then((data)=>{
    //         msg1.textContent =data.location.name;
    //         msg2.textContent =data.current.temperature;
    //         console.log(data.location.name);
    //         console.log(data.current.temperature);
    //     }).catch((errorcode)=>{
    //         msg1.textContent ='cannot get weather:'+errorcode;
    //         console.log('cannot get weather:'+errorcode);
    //     })
    // })
    const url = '/weather?address='+searchButton.value;
    axios.get(url).then(function (response) {
       console.log(response.data);
        msg1.textContent =response.data.location.name;
        msg2.textContent =response.data.current.temperature;

    })
        .catch(function (errorcode) {
            msg1.textContent ='cannot get weather:'+errorcode;
            console.log(error);
        });
})