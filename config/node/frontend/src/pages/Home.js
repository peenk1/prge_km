import React from 'react';
import {Typography, Button} from "@mui/material";

function Home(props) {
    return (
        <div className = 'home'>
            <h1 className = 'home__title'>GEOPORTAL</h1>

            <Typography className='home__subtile'>
                Geoportal tematyczny poswiecony danym przestrzennym.
            </Typography>

            <Button className='home__button' variant='contained' size='large'>START</Button>
        </div>
    );
}

export default Home;