import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Grid, Tooltip } from '@mui/material';
import { roundTo2decimal } from '../../Utility/RoundToDecimal';
import { calcDiff } from '../../Utility/CalcColorDiff';
import { renderColor } from './GameBoardScript';

type propType = {
    initTilesArray: any;
    initClosestColor: any;
    initMaxMoves: any;
    targetColor: any;
    showAlertDialog: Function;
    updateClosestColor: Function;
    upDateMaxMoves: Function;
}

const GameBoard = forwardRef(({ initTilesArray, initClosestColor, initMaxMoves, targetColor, showAlertDialog, updateClosestColor, upDateMaxMoves }: propType, ref) => {

    const [dragColor, setdragColor] = useState<any>([]);
    const [initialClick, setinitialClick] = useState(0);
    const [tilesArray, settilesArray] = useState<any>(initTilesArray)
    const [closestColor, setclosestColor] = useState<any>(initClosestColor)
    const [maxMoves, setmaxMoves] = useState(initMaxMoves)


    const resetState = async (data: any) => {
        setinitialClick(0);
        setdragColor([]);
        setmaxMoves(data.maxMoves);
        const diff = calcDiff(targetColor, [0, 0, 0])
        setclosestColor({ color: [0, 0, 0], diff: diff, tileAddress: [0, 0] })
        let circleEmem: any = document.getElementsByClassName('circle')
        for (var index = 0; index < circleEmem.length; index++) {
            circleEmem[index].setAttribute('style', `background: rgb(0,0,0)`)
        }
        settilesArray(data.arr);
    }


    useImperativeHandle(ref, () => ({
        reset(data: any) {
            resetState(data);
        }
    }));


    const initialClicked = (e: any, data?: any) => {
        if (initialClick === 0) {
            data['r'] = 255;
            data['g'] = 0;
            data['b'] = 0;
        } else if (initialClick === 1) {
            data['r'] = 0;
            data['g'] = 255;
            data['b'] = 0;
        } else if (initialClick === 2) {
            data['r'] = 0;
            data['g'] = 0;
            data['b'] = 255;
        }
        if(initialClick <= 2) {
            e.target.setAttribute('style', `background: rgb(${data['r']},${data['g']},${data['b']})`)
            setinitialClick(initialClick + 1)
            renderColorToRowColumn(data)
        }
    }

    const renderColorToRowColumn = (data: any) => {
        if (maxMoves > 0) {
            const value = renderColor(data, tilesArray, targetColor)
            settilesArray(value.arr.length > 0 ? value.arr : tilesArray)
            checkColorDiff(value.currentColorMixArray, value.arr)
            const movesLeft = maxMoves - 1;
            setmaxMoves(movesLeft)
            upDateMaxMoves(movesLeft)
            if (maxMoves - 1 < 1) {
                showAlertDialog()
            }
        }
    }

    const checkColorDiff = (currentColorMixArray: any, arr: any) => {
        let closestColorObject = currentColorMixArray.reduce((x1: any, x2: any) => x1.diff < x2.diff ? x1 : x2)
        const y1 = closestColor?.diff - closestColorObject.diff;
        if ((y1 >= 0)) {
            setclosestColor(closestColorObject);
            updateClosestColor(closestColorObject)
        } else if ((y1 < 0) && (currentColorMixArray.findIndex((elem: any) => elem.tileAddress[0] === closestColor?.tileAddress[0] && elem.tileAddress[1] === closestColor?.tileAddress[1]) >= 0)) {
            closestColorObject = [...arr].flat(2).reduce((x1, x2) => x1.diff < x2.diff ? x1 : x2);
            setclosestColor(closestColorObject);
            updateClosestColor(closestColorObject)
        }

        if (closestColorObject?.diff < 10) {
            showAlertDialog()
        }
    }



    const dragStart = (e: any, draggedData?: any) => {
        setdragColor(draggedData)
    }

    const dragDrop = (e: any, droppedContainer?: any) => {
        droppedContainer['r'] = dragColor[0];
        droppedContainer['g'] = dragColor[1];
        droppedContainer['b'] = dragColor[2];
        e.target.setAttribute('style', `background: rgb(${droppedContainer['r']},${droppedContainer['g']},${droppedContainer['b']})`)
        renderColorToRowColumn(droppedContainer)
    }

    const dragOver = (e: any) => {
        e.preventDefault();
        return true;
    }

    const dragEnter = (e: any) => {
        e.preventDefault();
        return true;
    }

    const circleBackground = (value: number[]) => {
        return {
            background: `rgb(${value[0]},${value[1]},${value[2]})`
        }
    }

    return (
        <>
            {tilesArray?.map((k: any, v: number) => {
                return <span key={v}>
                    {v === 0 &&
                        <Grid key={'top_' + v} container justifyContent="center">
                            {k?.map((z: any, y: number) => {
                                return <Grid item key={'top_' + y}>
                                    <span
                                        key={'top_' + v + y}
                                        className={'circle ' + ((initialClick <= 2) && 'pointer')}
                                        onDragEnter={dragEnter}
                                        onDrop={(e) => dragDrop(e, { start: 'top', index: y })}
                                        onDragOver={dragOver}
                                        onClick={(e) => (initialClick <= 2) && initialClicked(e, { start: 'top', index: y })}
                                        style={circleBackground([0,0,0])}
                                    >

                                    </span>
                                </Grid>
                            })}
                        </Grid>
                    }
                    <Grid key={'center_' + v} container justifyContent="center">
                        {k?.map((z: any, y: number) => {
                            return <Grid item key={'center' + y}>
                                <span key={y} className="display-flex">
                                    {y === 0 &&
                                        <span
                                            key={'left_' + v + y}
                                            className={'circle ' + ((initialClick <= 2) && 'pointer')}
                                            onDragEnter={dragEnter}
                                            onDrop={(e) => dragDrop(e, { start: 'left', index: v })}
                                            onDragOver={dragOver}
                                            onClick={(e) => (initialClick <= 2) && initialClicked(e, { start: 'left', index: v })}
                                            style={circleBackground([0, 0, 0])}
                                        >

                                        </span>
                                    }
                                    <Tooltip disableInteractive title={`${roundTo2decimal(z.color[0])} , ${roundTo2decimal((z.color)[1])} , ${roundTo2decimal(z.color[2])}`} placement="bottom-end">
                                        <span key={v.toString() + y.toString()}
                                            className={'square pointer ' + ((closestColor?.tileAddress[0] === v && closestColor?.tileAddress[1] === y) ? 'red_border' : '')}
                                            draggable={maxMoves > 0}
                                            onDragStart={(e) => dragStart(e, z.color)}
                                            style={circleBackground(z.color)}
                                        >

                                        </span>
                                    </Tooltip>
                                    {y === k.length - 1 &&
                                        <span
                                            key={'right_' + v + y}
                                            className={'circle ' + ((initialClick <= 2) && 'pointer')}
                                            onDragEnter={dragEnter}
                                            onDrop={(e) => dragDrop(e, { start: 'right', index: v })}
                                            onDragOver={dragOver}
                                            onClick={(e) => (initialClick <= 2) && initialClicked(e, { start: 'right', index: v })}
                                            style={circleBackground([0, 0, 0])}
                                        >

                                        </span>
                                    }
                                </span>
                            </Grid>
                        })}
                    </Grid>
                    {v === tilesArray?.length - 1 &&
                        <Grid key={'bottom_' + v} container justifyContent="center">
                            {k?.map((z: any, y: number) => {
                                return <Grid item key={'bottom_' + y}>
                                    <span
                                        key={'bottom_' + v + y}
                                        className={'circle ' + ((initialClick <= 2) && 'pointer')}
                                        onDragEnter={dragEnter}
                                        onDrop={(e) => dragDrop(e, { start: 'bottom', index: y })}
                                        onDragOver={dragOver}
                                        onClick={(e) => (initialClick <= 2)  && initialClicked(e, { start: 'bottom', index: y })}
                                        style={circleBackground([0, 0, 0])}
                                    >

                                    </span>
                                </Grid>
                            })}
                        </Grid>
                    }
                </span>
            })}
        </>
    )

})
export default GameBoard;