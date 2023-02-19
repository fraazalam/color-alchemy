import React, {useState, forwardRef, useImperativeHandle} from 'react';
import { Grid, Tooltip } from '@mui/material';
import { roundTo2decimal } from '../../Utility/RoundToDecimal';
import { calcDiff } from '../../Utility/CalcColorDiff';
import { renderColor } from './GameBoardScript';

type propType = {
    initTilesArray:any;
    initInitialCircleColor:any;
    initClosestColor: any;
    initMaxMoves: any;
    targetColor: any;
    showAlertDialog: Function;
    updateClosestColor: Function;
    upDateMaxMoves: Function;
}

const GameBoard = forwardRef(({ initTilesArray, initInitialCircleColor, initClosestColor, initMaxMoves, targetColor, showAlertDialog, updateClosestColor, upDateMaxMoves }: propType, ref) => {

    const [dragColor, setdragColor] = useState<any>([]);
    const [initialClick, setinitialClick] = useState(0);
    const [tilesArray, settilesArray] = useState<any>(initTilesArray)
    const [closestColor, setclosestColor] = useState<any>(initClosestColor)
    const [maxMoves, setmaxMoves] = useState(initMaxMoves)
    const [initialCircleColor, setinitialCircleColor] = useState<any>(initInitialCircleColor)


    const resetState = async (data: any) => {
        setinitialClick(0);
        setinitialCircleColor(data.initialCircleColor)
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
            e.target.setAttribute('style', 'background: rgb(255,0,0)')
            setinitialClick(initialClick + 1)
            renderColorToRowColumn(data)
        } else if (initialClick === 1) {
            data['r'] = 0;
            data['g'] = 255;
            data['b'] = 0;
            e.target.setAttribute('style', 'background: rgb(0,255,0)')
            setinitialClick(initialClick + 1)
            renderColorToRowColumn(data)
        } else if (initialClick === 2) {
            data['r'] = 0;
            data['g'] = 0;
            data['b'] = 255;
            e.target.setAttribute('style', 'background: rgb(0,0,255)')
            setinitialClick(initialClick + 1)
            renderColorToRowColumn(data)
        }
    }

    const renderColorToRowColumn = (data: any) => {
        if (maxMoves > 0) {
            const value = renderColor(data, tilesArray, targetColor)
            settilesArray(value.arr.length > 0 ? value.arr : tilesArray)
            checkColorDiff(value.currentColorMixArray, value.arr)
            const movesLeft = maxMoves - 1 ;
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
                                      className='circle'
                                      onDragEnter={dragEnter}
                                      onDrop={(e) => dragDrop(e, { start: 'top', index: y })}
                                      onDragOver={dragOver}
                                      onClick={(e) => initialClicked(e, { start: 'top', index: y })}
                                      style={{ background: `rgb(${initialCircleColor[0]},${initialCircleColor[1]},${initialCircleColor[2]})` }}
                                  >
                                      top {v} {y}
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
                                          className='circle'
                                          onDragEnter={dragEnter}
                                          onDrop={(e) => dragDrop(e, { start: 'left', index: v })}
                                          onDragOver={dragOver}
                                          onClick={(e) => initialClicked(e, { start: 'left', index: v })}
                                          style={{ background: `rgb(${initialCircleColor[0]},${initialCircleColor[1]},${initialCircleColor[2]})` }}
                                      >
                                          {v} {y}
                                      </span>
                                  }
                                  <Tooltip title={`${roundTo2decimal(z.color[0])} , ${roundTo2decimal((z.color)[1])} , ${roundTo2decimal(z.color[2])}`} placement="bottom-end">
                                      <span key={v.toString() + y.toString()}
                                          className={'square ' + ((closestColor?.tileAddress[0] === v && closestColor?.tileAddress[1] === y) ? 'red_border' : '')}

                                          draggable={maxMoves > 0}
                                          onDragStart={(e) => dragStart(e, z.color)}
                                          style={{ background: `rgb(${z.color[0]},${z.color[1]},${z.color[2]})` }}
                                      >
                                          {v} {y}
                                      </span>
                                  </Tooltip>
                                  {y === k.length - 1 &&
                                      <span
                                          key={'right_' + v + y}
                                          className='circle'
                                          onDragEnter={dragEnter}
                                          onDrop={(e) => dragDrop(e, { start: 'right', index: v })}
                                          onDragOver={dragOver}
                                          onClick={(e) => initialClicked(e, { start: 'right', index: v })}
                                          style={{ background: `rgb(${initialCircleColor[0]},${initialCircleColor[1]},${initialCircleColor[2]})` }}
                                      >
                                          {v} {y}
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
                                      className='circle'
                                      onDragEnter={dragEnter}
                                      onDrop={(e) => dragDrop(e, { start: 'bottom', index: y })}
                                      onDragOver={dragOver}
                                      onClick={(e) => initialClicked(e, { start: 'bottom', index: y })}
                                      style={{ background: `rgb(${initialCircleColor[0]},${initialCircleColor[1]},${initialCircleColor[2]})` }}
                                  >
                                      bottom {v} {y}
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