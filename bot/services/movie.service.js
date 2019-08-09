import axios from 'axios'
import stripeMod from 'stripe'

const API = 'https://api.themoviedb.org/3'
const API_KEY = process.env.MOVIE_DB_KEY
const stripe = stripeMod(process.env.STRIPE_KEY)

class MovieService {
    discover() {
        return axios.get(`${API}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
            .then(res => res.data.results)
    }

    buy(stripeToken, movie) {
        return stripe.charges.create({
            amount: movie.price * 100,
            currency: 'usd',
            description: 'Movie Payment',
            source: stripeToken,
            metadata: { movieId: movie.id }
        })
    }
}

export const movieService = new MovieService()