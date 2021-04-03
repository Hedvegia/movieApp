import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import * as React from 'react';
import { Header } from '../components/header/header';
import { Loader } from '../components/loader/loader';
import { Movies } from '../components/movies/movies';
import { MOVIE_QUERY, SEARCH } from '../query/query';
import './dashboard.scss';

const client = new ApolloClient({
    uri: 'https://tmdb.sandbox.zoosh.ie/dev/graphql',
    cache: new InMemoryCache()
});

export class Dashboard extends React.Component {
    state: any = {
        type: 'Popular',
        loading: false,
        error: false,
        movies: []
    };

    componentDidMount = (): void => {
        document.title = 'Apex Lab Movie app';

        this.fetch();
    };

    fetch = (): any => {
        this.setState({ loading: true });

        client.query({
            query: MOVIE_QUERY,
        })
            .then((result: any) => this.setState({ movies: result.data.movies, type: 'Popular' }))
            .catch((err: any) => this.setState({ error: err }))
            .finally(() => this.setState({ loading: false }));
    };

    search = (text: string = ''): any => {
        this.setState({ loading: true });

        client.query({
            query: SEARCH,
            variables: { query: text }
        })
            .then((result: any) => this.setState({ movies: result.data.searchMovies, type: `Searched for ${text}` }))
            .catch((err: any) => this.setState({ error: err }))
            .finally(() => this.setState({ loading: false }));
    };

    render = () => {
        return <div className="Dashboard">
            <Header fetch={(text: any) => this.search(text)} fetchPopular={() => this.fetch()}/>
            <Box className="Movies">
                {this.state.loading && <Loader/>}
                {!this.state.loading && !(this.state.movies || []).length && this.renderEmpty()}
                {!this.state.loading && !!(this.state.movies || []).length && <Movies type={this.state.type} movies={this.state.movies}/>}
            </Box>
        </div>;
    };

    renderEmpty() {
        return <Typography paragraph={true} className="Title">There is no any movie for {this.state.type}, please type something else.</Typography>;
    }
}
