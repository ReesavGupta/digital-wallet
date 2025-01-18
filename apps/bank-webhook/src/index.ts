import express from 'express'

const app = express()

app.get('/', (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  }
})

app.listen(3002, () => {
  console.log(`listening on port : 3002`)
})
