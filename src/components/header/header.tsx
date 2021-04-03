import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { debounce, get } from 'lodash';
import * as React from 'react';
import './header.scss';

export class Header extends React.Component<any, any> {
    text: any = React.createRef();

    state: any = {
        openInput: false
    };

    componentDidMount() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleSearchForEnterOrClick();
            }
        });
    }

    componentWillUnmount = () => {
        window.removeEventListener('keydown', (event) => event.stopPropagation());
    };

    render = (): React.ReactNode => {
        return <Box display="flex" justifyContent="space-between" flexWrap="wrap" bgcolor="text.primary" className="Header">
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" className="HeaderComponent">
                <Button onClick={() => this.fetchPopularAgain()}>
                    <Typography variant="button" className="Title">Apex Lab - Movies</Typography>
                </Button>

                {!this.state.openInput && <IconButton onClick={() => this.handleInputClick()}>
                    <SearchRoundedIcon color="error"/>
                </IconButton>}
                {!!this.state.openInput && <TextField
                    autoFocus={true}
                    inputRef={this.text}
                    className="SearchFieldFocus"
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => this.handleSearchForEnterOrClick()}>
                                    <SearchRoundedIcon color="error"/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    onFocus={() => this.setState({ openInput: true })}
                    onBlur={() => this.setState({ openInput: false })}
                    onChange={this.handleChange}
                />}
            </Box>
        </Box>;
    };

    fetchPopularAgain = (): void => {
        if (this.props.fetchPopular) {
            this.props.fetchPopular();
        }
    };

    handleInputClick = (): void => {
        this.setState({ openInput: true });
    };

    handleSearchForEnterOrClick = (): void => {
        this.fetch();
        this.setState({ openInput: false });
    };

    handleChange: any = debounce(() => this.fetch(), 1000);

    fetch = (): void => {
        if (this.props.fetch && !!get(this.text.current, 'value')) {
            this.props.fetch(this.text.current.value || '');
        }
    };
}
