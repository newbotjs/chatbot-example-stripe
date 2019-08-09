
import formats from 'newbot-formats'
import code from './movie.converse'
import { movieService } from '../../services/movie.service'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export default {
    code,
    skills: {
        formats
    },
    functions: {
        async fetchDiscoverMovies() {
            const { webview } = this.converse.data
            const movies = await movieService.discover()
            return movies.map(movie => {
                const data = {
                    title: movie.title,
                    image: IMAGE_BASE_URL + movie.poster_path,
                    backdrop: IMAGE_BASE_URL + movie.backdrop_path
                }
                return {
                    ...data,
                    buttons: [
                        {
                            type: 'webview',
                            url: webview('/webview/stripe.html', {
                                price: 4.99,
                                movieId: movie.id,
                                ...data
                            }),
                            title: 'Buy'
                        }
                    ]
                }
            })

        },
        buy: movieService.buy
    }
}