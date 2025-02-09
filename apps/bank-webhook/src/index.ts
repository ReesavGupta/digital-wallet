import express from 'express'
import db from '@repo/db/client'
const app = express()

app.use(express.json())

app.post('/hdfcTransaction', async (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  }
  try {
    const checkStatusOfTxn = await db.onRampTransactions.findUnique({
      where: {
        token: paymentInformation.token,
      },
    })

    if (checkStatusOfTxn?.status !== 'completed') {
      await db.$transaction([
        db.balance.update({
          where: {
            userId: Number(paymentInformation.userId),
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
      return
    }
    res.status(400).json({ message: 'transasction isn`t in processing state' })
  } catch (error) {
    console.log('error : ', error)
    res.status(500).json('Couldnt process transaction')
  }
})

app.listen(3002, () => {
  console.log(`listening on port : 3002`)
})
