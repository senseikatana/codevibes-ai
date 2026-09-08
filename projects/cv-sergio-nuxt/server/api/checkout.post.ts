import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, message: 'Stripe not configured' })
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  })

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.items.map((item: { priceId: string; quantity: number }) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${config.public.siteUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.siteUrl}/store`,
    })

    return { url: session.url }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating checkout session'
    throw createError({ statusCode: 500, message })
  }
})
