'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import prisma from '@repo/db/client'

export const createOnrampTransaction = async (
  amount: number,
  provider: string
) => {
  const serverSession = await getServerSession(authOptions)
  const userId = serverSession.user.id

  if (!userId) {
    return {
      message: 'unauthenticated user',
    }
  }

  // ideally the token should come from the bank API(axis/hdfc etc...)
  const token = (Math.random() * 100).toString()

  await prisma.onRampTransactions.create({
    data: {
      provider,
      status: 'processing',
      startTime: new Date(),
      token: token,
      userId: Number(userId),
      amount: amount * 100,
    },
  })

  return {
    message: 'done',
  }
}
