import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Box, IconButton, Link, Modal, Typography } from '@material-ui/core';
import BrokenImageRoundedIcon from '@material-ui/icons/BrokenImageRounded';
import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import axios from 'axios';
import { get } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { GET_MOVIE } from '../../query/query';
import { Loader } from '../loader/loader';
import './movie-details.scss';

const client = new ApolloClient({
    uri: 'https://tmdb.sandbox.zoosh.ie/dev/graphql',
    cache: new InMemoryCache()
});

export class MovieDetails extends React.Component<any, any> {
    state: any = {
        loading: false,
        movie: null,
        seeMore: false,
        seeMoreCast: false,
        seeComments: false,
        wikipedia: false
    };

    componentDidUpdate = (prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void => {
        if (this.props.movie !== prevProps.movie && !!this.props.movie) {
            this.fetch();
        }
    }

    fetch = (): void => {
        this.setState({ loading: true });

        client.query({
            query: GET_MOVIE,
            variables: { id: this.props.movie }
        })
            .then((result: any) => {
                this.setState({ movie: result.data.movie });
                this.fetchWikipedia();
            })
            .catch((err: any) => this.setState({ error: err, loading: false }))
    };

    fetchWikipedia = (): void => {
        axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=1&prop=extracts|pageimages&pithumbsize=400&origin=*&exintro&explaintext&exsentences=3&exlimit=max&gsrsearch=${get(this.state, 'movie.name')}`)
            .then((resp) => {
                const wikiResp = get(resp.data.query, 'pages');
                const key = Object.keys(wikiResp);

                this.setState({ wikipedia: get(wikiResp[key], 'extract'), loading: false });
            })
            .catch((err) => this.setState({ wikipedia: false }));
    };

    render = (): React.ReactNode => {
        return <Modal
            open={this.props.movie ? true : false}
            onClose={() => this.handleClose()}
            className="ModalBox"
        >
            <Box className="ContentContainer">
                {this.state.loading && <Loader/>}
                {!this.state.loading && this.state.movie && this.renderContent()}
            </Box>
        </Modal>;
    };

    renderContent = (): React.ReactNode => {
        const movie: any = this.state.movie;

        return <Box className="ContentContainer">
            <Box position="absolute" top={0} right={0}>
                <IconButton onClick={() => this.handleClose()}>
                    <HighlightOffRoundedIcon color="error"/>
                </IconButton>
            </Box>

            <Box className="Details">
                {get(movie, 'img.url') && <img height={300} width={200} src={get(movie, 'img.url')} style={{ borderRadius: 5 }}/>}
                {!get(movie, 'img.url') && <Box display="flex" className="EmptyImage" height={300} width={200} justifyContent="center" alignItems="center">
                    <BrokenImageRoundedIcon color="error"/>
                </Box>}

                <Box className="Content">
                    <Typography variant="h4" className="Title">{movie.name}</Typography>

                    <Box display="flex" justifyContent="space-between" flexWrap="wrap" className="DetailsBox">
                        <Box display="flex" alignItems="center">
                            <ScheduleRoundedIcon color="error" className="Icon"/>
                            <Typography paragraph={true} className="Title">{movie.runtime} min</Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <StarRoundedIcon color="error" className="Icon"/>
                            <Typography paragraph={true} className="Title">{movie.score}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <CalendarTodayRoundedIcon color="error" className="Icon"/>
                            <Typography paragraph={true} className="Title">{moment(movie.releaseDate).format('DD. MM. YYYY.')}</Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" flexWrap="wrap">
                        {(movie.genres || []).map((genre) => this.renderGenre(genre))}
                    </Box>

                    <Box>
                        <Typography paragraph={true} className="Description">{this.renderDetails(movie.overview)}</Typography>
                        {(movie.overview || '').length > 300 &&
                        <Typography paragraph={true} className="ShowMore" onClick={() => this.setState({ seeMore: !this.state.seeMore })}>{this.state.seeMore ? 'Show less' : 'Show more'}</Typography>}
                    </Box>
                </Box>
            </Box>

            <Box className="Wikipedia">
                <Typography paragraph={true} className="Title">Cast</Typography>
                <Box display="flex" alignItems="center" flexWrap="wrap" className="CastContainer">
                    {(movie.cast.slice(0, this.state.seeMoreCast ? movie.cast.length - 1 : 5) || []).map((member) => this.renderCast(member))}
                </Box>
                {(movie.overview || '').length > 300 &&
                <Typography paragraph={true} className="ShowMore" onClick={() => this.setState({ seeMoreCast: !this.state.seeMoreCast })}>{this.state.seeMoreCast ? 'Show less' : 'Show more'}</Typography>}
            </Box>

            {!!this.state.wikipedia && <Box display="flex" flexDirection="column" flexWrap="wrap" className="Wikipedia">
                <Typography paragraph={true} className="Title WikipediaTitle">Wikipedia</Typography>
                <Typography paragraph={true} className="Title">{this.state.wikipedia}</Typography>
                <Link href={`https://en.wikipedia.org/wiki/${movie.name.split(' ').join('_')}`} className="Link" target="_blank" color="error">See more on wiki</Link>
            </Box>}
        </Box>;
    };

    renderGenre = (genre): React.ReactNode => {
        return <Box className="GenreBox" key={'_' + Math.random().toString(36).substr(2, 9)}>
            <Typography paragraph={true} className="Title">{genre.name}</Typography>
        </Box>;
    };

    renderDetails = (details): string => {
        if (details.length > 300 && !this.state.seeMore) {
            return `${details.substr(0, 300)}...`;
        }

        return details;
    };

    renderCast = (member): React.ReactNode => {
        return <Box display="flex" key={'_' + Math.random().toString(36).substr(2, 9)} className="Class">
            <Typography paragraph={true}>{member.person.name} - {member.role.character},</Typography>
        </Box>;
    };

    handleClose = (): void => {
        this.setState({ movie: null });
        if (this.props.close) {
            this.props.close();
        }
    };
}
