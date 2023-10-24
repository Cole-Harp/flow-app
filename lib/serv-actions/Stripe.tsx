import prisma_db from "../prisma_db";
import { absoluteUrl } from "../utils";
import { getUser } from "./User"
import { PLANS } from '@/config/stripe'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2023-08-16',
    typescript: true,
  })

  export async function createStripeSession() {

    const userId = (await getUser()).id;

      const billingUrl = absoluteUrl('/dashboard/billing')

      if (!userId)
        throw new Error( 'UNAUTHORIZED' )

      const dbUser = await prisma_db.user.findFirst({
        where: {
          id: userId,
        },
      })

      if (!dbUser)
        throw new Error('UNAUTHORIZED')

      const subscriptionPlan =
        await getUserSubscriptionPlan()

      if (
        subscriptionPlan.isSubscribed &&
        dbUser.stripeCustomerId
      ) {
        const stripeSession =
          await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: billingUrl,
          })

        return { url: stripeSession.url }
      }

      const stripeSession =
        await stripe.checkout.sessions.create({
          success_url: billingUrl,
          cancel_url: billingUrl,
          payment_method_types: ['card', 'paypal'],
          mode: 'subscription',
          billing_address_collection: 'auto',
          line_items: [
            {
              price: PLANS.find(
                (plan) => plan.name === 'Pro'
              )?.price.priceIds.test,
              quantity: 1,
            },
          ],
          metadata: {
            userId: userId,
          },
        })

      return { url: stripeSession.url }
    }






export async function getUserSubscriptionPlan() {

  const user = await getUser()

  if (!user.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    }
  }

  const dbUser = await prisma_db.user.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    }
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  )

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
    : null

  let isCanceled = false
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  }
}