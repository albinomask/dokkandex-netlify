const process = require('process')

const { Client, query } = require('faunadb')

const cards = require('../cards.json');

/* configure faunaDB Client with our secret */
const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
  domain: process.env.FAUNADB_SERVER_DOMAIN
})

/* export our lambda function as named "handler" export */
const handler = async (event) => {
  /* parse the string body into a useable JS object */
  const data = JSON.parse(event.body)
  console.log('Function `create` invoked', data)
  /* construct the fauna query */
  try {
    if(!cards[data.card_id])
      throw "error";

    if(data.name.length == 0 || data.name.length > 32)
      throw "error";
    
    if(data.password.length < 4 || data.password.length > 32)
      throw "error";

    const response = await client.query(query.Create(query.Collection('comments'), {data}))
    console.log('success', response)
    /* Success! return the response with statusCode 200 */
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.log('error', error)
    /* Error! return the error with statusCode 400 */
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

module.exports = { handler }