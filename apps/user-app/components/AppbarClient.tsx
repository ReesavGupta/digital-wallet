'use client'
import { Appbar } from '@repo/ui/appbar'
import { signIn, signOut, useSession } from 'next-auth/react'

export const AppbarClient = () => {
  const session = useSession()
  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => await signOut()}
        user={session.data?.user}
      />
    </div>
  )
}
