const axios = require('axios')

async function forecast(location){
    const url = 'http://api.weatherstack.com/current?access_key=70a02669e7d55a581864b865ec6a8e94&query='+location;
    try {
        const response = await axios.post(url);
        console.log('inside then of forecast'+response);
       // throw 'my error';
        return response.data;
    } catch (error) {
        console.error(error);
        throw 'Error in fetching weather for'+location;
        // Error('Error in fetching weather for'+location); will return a resolved Promise with the error wrapped
    }
}

//this function is using the old callback method for async communication
// const forecast = (location, callback) => {
//     const url = 'http://api.weatherstack.com/current?access_key=70a02669e7d55a581864b865ec6a8e94&query='+location;
//
//     axios.post(url).then((response)=>{
//         //axis automatically convert the result from JSON String into JS object
//         callback(undefined, response.data.current )
//         console.log(response.data.current)
//         //calling then() with no handler function (here error handler) act as passthrough.  so here the then() willreturn a rejected
//         // Promise with the same error as the original Promise (generated from the post method). this rejected Promise is then caught by
//         //the catch handler
//     }).catch((error)=>{
//         console.log(error);
//         callback('Unable to connect to weather service!', undefined)
//     });
// }

module.exports = forecast