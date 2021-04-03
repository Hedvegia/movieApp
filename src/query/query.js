import {gql} from '@apollo/client';

const movieDetails = `
    id
    name
    score
    runtime
    genres {
        name
    }
    img: poster {
        url: custom(size: "w185_and_h278_bestv2")
    }
`

export const MOVIE_QUERY = gql`
query fetchPopular {
    movies: popularMovies {
        ${movieDetails}
    }
}
`

export const SEARCH = gql`
query SearchMovies($query: String!) {
    searchMovies(query: $query) {
        ${movieDetails}
    }
}`

export const GET_MOVIE = gql`
query GetMovie($id: ID!) {
    movie(id: $id) {
        ${movieDetails}
        overview
        releaseDate
        cast {
            id
            person {
                name
            }
            role {
                ... on Cast {
                    character
                }
            }
        }
    }
}`
