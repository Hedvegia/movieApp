import { Box } from '@material-ui/core';
import * as React from 'react';
import './loader.scss';

export class Loader extends React.Component<any, any> {
    render = (): React.ReactNode => {
        return <Box className="LoaderContainer" position="absolute" top={0} left={0} right={0} bottom={0} display="flex" justifyContent="center" alignItems="center">
            <Box className="Loader"/>
        </Box>;
    };
}
