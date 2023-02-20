import React from 'react';
import './Details.css';
import { Grid, Typography, Tooltip } from '@mui/material';
import ChangeHistoryRoundedIcon from '@mui/icons-material/ChangeHistoryRounded';
import { roundTo2decimal } from '../../Utility/RoundToDecimal';


type prototype = {
    userId: any;
    maxMoves: any;
    targetColor: any;
    closestColor: any;
}

const Details = ({ userId, maxMoves, targetColor, closestColor }: prototype) => {
    return (
        <>
            <Grid container justifyContent="center">
                <Grid item>
                    <Typography variant='h6' gutterBottom>
                        RGB Alchemy
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        User ID: {userId}
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        Moves Left: {maxMoves}
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        <Grid container alignItems="center">
                            <Grid item>
                                Target Color:
                            </Grid>
                            <Grid item>
                                <Tooltip title={`${roundTo2decimal(targetColor[0])} , ${roundTo2decimal(targetColor[1])} , ${roundTo2decimal(targetColor[2])}`} placement="bottom-end">
                                    <span
                                        className='square'
                                        style={{ background: `rgb(${targetColor[0]},${targetColor[1]},${targetColor[2]})` }}
                                    >
                                    </span>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Typography>
                    <Typography variant='subtitle1' gutterBottom>
                        <Grid container alignItems="center">
                            <Grid item>
                                Closest Color:
                            </Grid>
                            <Grid item>
                                <Tooltip title={`${roundTo2decimal(closestColor?.color[0])} , ${roundTo2decimal(closestColor?.color[1])} , ${roundTo2decimal(closestColor?.color[2])}`} placement="bottom-end">
                                    <span
                                        className='square'
                                        style={{ background: `rgb(${closestColor?.color[0]},${closestColor?.color[1]},${closestColor?.color[2]})` }}
                                    >
                                    </span>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <ChangeHistoryRoundedIcon /> =
                            </Grid>
                            <Grid item>
                                {roundTo2decimal(closestColor?.diff)} %
                            </Grid>
                        </Grid>
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default Details;

