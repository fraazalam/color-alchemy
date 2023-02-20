import React, { useState, useImperativeHandle, forwardRef } from 'react'
import './AlertDialog.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid, Tooltip, Button } from '@mui/material';
import { roundTo2decimal } from '../../Utility/RoundToDecimal';
import ChangeHistoryRoundedIcon from '@mui/icons-material/ChangeHistoryRounded';

const AlertDialog = forwardRef(({ targetColor, closestColor, resetGame }: any, ref) => {
    const [showAlertDialog, setshowAlertDialog] = useState(false)


    const updateshowAlertDialog = (value: boolean) => {
        setshowAlertDialog(value);
    }

    useImperativeHandle(ref, () => ({
        updateshowAlertDialog(value: boolean) { updateshowAlertDialog(value) }
    })
    )

    return (
        <Dialog
            open={showAlertDialog}
        >
            <DialogTitle>
                {/* <Typography variant='h6' gutterBottom> */}
                RGB Alchemy
                {/* </Typography> */}
            </DialogTitle>
            <DialogContent>
                {/* <DialogContentText> */}
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
                            {/* {roundTo2decimal(targetDiffernce)}% */}
                            {closestColor?.diff} %
                        </Grid>
                    </Grid>
                </Typography>
                <Typography variant='subtitle1'>Result: {closestColor?.diff < 10 ? 'Success' : 'Failed'}</Typography>
                <Typography variant='subtitle1'>
                    Do you want to play the game again?
                </Typography>
                {/* </DialogContentText> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => updateshowAlertDialog(false)}>Disagree</Button>
                <Button onClick={resetGame}>Agree</Button>
            </DialogActions>
        </Dialog>
    )
})

export default AlertDialog;