import express from 'express'
import db from '@repo/db/client'
const app = express()

app.post('/hdfcTransaction', async (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  }
  try {
    await db.$transaction([
      db.balance.update({
        where: {
          id: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),

      db.onRampTransactions.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: 'completed',
        },
      }),
    ])

    res.status(200).json('captured')
  } catch (error) {
    res.status(500).json('Couldnt process transaction')
  }
})

app.listen(3002, () => {
  console.log(`listening on port : 3002`)
})
