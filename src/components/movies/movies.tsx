import { Box, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import BrokenImageRoundedIcon from '@material-ui/icons/BrokenImageRounded';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import { get } from 'lodash';
import * as React from 'react';
import { MovieDetails } from '../movie-details/movie-details';
import './movies.scss';

export class Movies extends React.Component<any, any> {
    state = {
        selectedMovie: false
    };

    render = (): React.ReactNode => {
        return <Box className="MoviesContent">
            <Box className="TypeBox">
                <Typography variant="h4" className="Title">{this.props.type}</Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" className="CardsContainer">
                {(this.props.movies || []).map((movie) => this.renderImage(movie))}
            </Box>

            <MovieDetails movie={this.state.selectedMovie} close={() => this.setState({ selectedMovie: false })}/>
        </Box>;
    };

    renderImage = (movie) => {
        return <Box key={movie.id} className="Card" display="flex">
            <Card className="MovieCard" onClick={() => this.setState({ selectedMovie: movie.id })}>
                {get(movie.img, 'url') && <CardMedia
                    component="img"
                    height="250"
                    width="auto"
                    src={get(movie.img, 'url')}
                />}

                {!get(movie.img, 'url') && <Box display="flex" height={250} justifyContent="center" alignItems="center">
                    <BrokenImageRoundedIcon color="error"/>
                </Box>}

                <CardContent className="CardContent">
                    <Typography variant="h6" className="Title">
                        {movie.name}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" className="DetailsBox">
                        <Box display="flex" alignItems="center">
                            <ScheduleRoundedIcon color="error" className="Icon"/>
                            <Typography paragraph={true} className="Title">{movie.runtime} min</Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <StarRoundedIcon color="error" className="Icon"/>
                            <Typography paragraph={true} className="Title">{movie.score}</Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" flexWrap="wrap">
                        {(movie.genres || []).map((genre) => this.renderGenre(genre))}
                    </Box>
                </CardContent>
            </Card>
        </Box>;
    };

    renderGenre = (genre) => {
        return <Box className="GenreBox" key={'_' + Math.random().toString(36).substr(2, 9)}>
            <Typography paragraph={true} className="Title">{genre.name}</Typography>
        </Box>;
    };
}
