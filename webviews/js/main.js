const bot = new NewBot(NEWBOT_PUBLIC_KEY)
const stripe = Stripe(STRIPE_PUBLIC_KEY)

new Vue({
  el: '#app',
  data() {
    return {
      params: {},
      error: '',
      card: null,
      webview: null
    }
  },
  async mounted() {
    this.webview = await bot.loadWebView()
    this.params = this.webview.params

    this.$el.style.display = 'block' // display after loading

    const elements = stripe.elements()
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
    this.card = elements.create('card', {
      style: style
    })
    this.card.mount('#card-element')
    this.card.addEventListener('change', (event) => this.error = event.error ? event.error.message : '')
  },
  methods: {
    async buy() {
      try {
        const result = await stripe.createToken(this.card)
        if (result.error) {
          this.error = result.error.message
          return
        }
        await this.webview.event('movie.buy', {
          stripeToken: result.token.id
        })
        this.webview.close()
      } catch (err) {
        this.error = err.message
      }
    }
  }
})