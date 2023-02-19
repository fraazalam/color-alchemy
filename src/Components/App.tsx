/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, lazy, useRef, Suspense } from 'react';
import './App.css';
import { initResp, RespType } from '../services/api'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
const Details = lazy(() => import('./Details/Details').then((module) => ({ default: module.default })));
const AlertDialog = lazy(() => import('./AlertDialog/AlertDialog').then((module) => ({ default: module.default })));
const GameBoard = lazy(() => import('./GameBoard/GameBoard').then(module => ({default: module.default})))


type InitialStateType = {
  initialCircleColor: any;
  initialData: any;
  tilesArray: any;
  error: any;
  initialClick: number;
  dragColor: any;
  maxMoves: number;
  targetColor: any;
  closestColor: any;
  openDialog: any;
}

const initialState: InitialStateType = {
  initialCircleColor: [0, 0, 0],
  initialData: {},
  tilesArray: [],
  error: {},
  initialClick: 0,
  dragColor: [],
  maxMoves: 0,
  targetColor: Array(3).fill(0),
  closestColor: { color: [0, 0, 0], diff: 0, tileAddress: [0, 0] },
  openDialog: false,
}

const App = () => {

  const AlertDialogRef = useRef<any>();
  const GameBoardRef = useRef<any>();
  // const DetailsRef = useRef<any>();

  const [initialCircleColor, setinitialCircleColor] = useState([0, 0, 0])
  const [initialData, setInitialData] = useState<RespType>()
  const [tilesArray, settilesArray] = useState<any>()
  const [error, seterror] = useState({})
  // const [initialClick, setinitialClick] = useState(0)
  // const [dragColor, setdragColor] = useState([])
  const [maxMoves, setmaxMoves] = useState(0)
  const [targetColor, settargetColor] = useState(Array(3).fill(0))
  const [closestColor, setclosestColor] = useState({ color: [0, 0, 0], diff: 0, tileAddress: [0, 0] })
 
  useEffect(() => {
    initResp(initialData?.userId).then((value: any) => {
      const data: any = value;     
      createSquareTilesArray(data);
    }).catch((err: any) => {
      seterror(err)
      console.log('use effect error', error)
    })


  }, [])

  const resetGame = () => {
    initResp(initialData?.userId).then((value: any) => {
      const data: any = value;
      resetState(data);
      setTimeout(() => {
        createSquareTilesArray(data);
      }, 10);
    }).catch((err: any) => {
      seterror(err)
      console.log('use effect error', error)
    })
  }

  const resetState = async (data: any) => {
    setinitialCircleColor(initialState.initialCircleColor);
    setInitialData(initialState.initialData);
    settilesArray(initialState.tilesArray);
    seterror(initialState.error);
    // setinitialClick(initialState.initialClick);
    // setdragColor(initialState.dragColor);
    setmaxMoves(initialState.maxMoves);
    settargetColor(initialState.targetColor);
    setclosestColor({ color: [0, 0, 0], diff: 0, tileAddress: [0, 0] });
    AlertDialogRef.current?.updateshowAlertDialog();
  }

  const createSquareTilesArray = (data: any) => {
    let arr = Array.from(Array(data.height), (val, index) => Array.from(Array(data.width), (k, v) => ({
      color: [0, 0, 0],
      topColor: [0, 0, 0],
      rightColor: [0, 0, 0],
      bottomColor: [0, 0, 0],
      leftColor: [0, 0, 0],
      diff: calcDiff([0, 0, 0], data.target),
      tileAddress: [index, v]
    })));
    console.log(arr);
    settilesArray(arr)
    setInitialData(data)
    setmaxMoves(data.maxMoves)
    setinitialCircleColor([0, 0, 0])
    settargetColor([...data.target])
    const diff = calcDiff(data.target, [0,0,0])
    setclosestColor({ color: [0, 0, 0], diff: diff, tileAddress: [0, 0] })
    GameBoardRef.current?.reset({ arr: arr, closestColor: closestColor, initialCircleColor: [0, 0, 0], maxMoves: data.maxMoves })
  }

  // const initialClicked = (e: any, data?: any) => {
  //   console.log(e)
  //   if (initialClick === 0) {
  //     data['r'] = 255;
  //     data['g'] = 0;
  //     data['b'] = 0;
  //     e.target.setAttribute('style', 'background: rgb(255,0,0)')
  //     setinitialClick(initialClick + 1)
  //     renderColorToRowColumn(data)
  //   } else if (initialClick === 1) {
  //     data['r'] = 0;
  //     data['g'] = 255;
  //     data['b'] = 0;
  //     e.target.setAttribute('style', 'background: rgb(0,255,0)')
  //     setinitialClick(initialClick + 1)
  //     renderColorToRowColumn(data)
  //   } else if (initialClick === 2) {
  //     data['r'] = 0;
  //     data['g'] = 0;
  //     data['b'] = 255;
  //     e.target.setAttribute('style', 'background: rgb(0,0,255)')
  //     setinitialClick(initialClick + 1)
  //     renderColorToRowColumn(data)
  //   }
  // }

  // const renderColorToRowColumn = (data: any) => {
  //   if (maxMoves > 0) {
  //     let arr: any = [];
  //     const currentColorMixArray: any = [];
  //     switch (data.start) {
  //       case 'top':
  //         arr = tilesArray.map((elem: any, index: any) => elem.map((k: any, v: number) => {
  //           if (v === data.index) {
  //             let r = Number(data.r) * (tilesArray.length + 1 - index) / (tilesArray.length + 1)
  //             let g = Number(data.g) * (tilesArray.length + 1 - index) / (tilesArray.length + 1)
  //             let b = Number(data.b) * (tilesArray.length + 1 - index) / (tilesArray.length + 1)
  //             const r1 = r + Number(k.rightColor[0]) + Number(k.bottomColor[0]) + Number(k.leftColor[0])
  //             const g1 = g + Number(k.rightColor[1]) + Number(k.bottomColor[1]) + Number(k.leftColor[1])
  //             const b1 = b + Number(k.rightColor[2]) + Number(k.bottomColor[2]) + Number(k.leftColor[2])
  //             const f = 255 / Math.max(r1, g1, b1, 255)
  //             const color = [r1 * f, g1 * f, b1 * f]
  //             currentColorMixArray.push({
  //               color: color,
  //               diff: calcDiff(color, targetColor),
  //               tileAddress: [index, v]
  //             })
  //             return {
  //               color: color,
  //               topColor: [r, g, b],
  //               rightColor: k.rightColor,
  //               bottomColor: k.bottomColor,
  //               leftColor: k.leftColor,
  //               diff: calcDiff(color, targetColor),
  //               tileAddress: [index, v]
  //             }
  //             // return { ...k, 'color': [r1 * f, g1 * f, b1 * f], 'topColor': [Number(data.r), Number(data.g), Number(data.b)] }
  //           } else {
  //             return k
  //           }
  //         }));

  //         console.log(arr)
  //         settilesArray(arr)
  //         break;

  //       case 'bottom':
  //         arr = tilesArray.map((elem: any, index: any) => elem.map((k: any, v: number) => {
  //           if (v === data.index) {
  //             let r = Number(data.r) * (tilesArray.length + 1 - (tilesArray.length - (index + 1))) / (tilesArray.length + 1)
  //             let g = Number(data.g) * (tilesArray.length + 1 - (tilesArray.length - (index + 1))) / (tilesArray.length + 1)
  //             let b = Number(data.b) * (tilesArray.length + 1 - (tilesArray.length - (index + 1))) / (tilesArray.length + 1)
  //             const r1 = Number(k.topColor[0]) + Number(k.rightColor[0]) + r + Number(k.leftColor[0])
  //             const g1 = Number(k.topColor[1]) + Number(k.rightColor[1]) + g + Number(k.leftColor[1])
  //             const b1 = Number(k.topColor[2]) + Number(k.rightColor[2]) + b + Number(k.leftColor[2])
  //             const f = 255 / Math.max(r1, g1, b1, 255)
  //             const color = [r1 * f, g1 * f, b1 * f]
  //             currentColorMixArray.push({
  //               color: color,
  //               diff: calcDiff(color, targetColor),
  //               tileAddress: [index, v]
  //             })
  //             return {
  //               color: color,
  //               topColor: k.topColor,
  //               rightColor: k.rightColor,
  //               bottomColor: [r, g, b],
  //               leftColor: k.leftColor,
  //               diff: calcDiff(color, targetColor),
  //               tileAddress: [index, v]
  //             }
  //             // return { ...k, 'color': [r1 * f, g1 * f, b1 * f], 'bottomColor': [Number(data.r), Number(data.g), Number(data.b)] }
  //             // return { ...k, 'color': [r, g, b] }
  //           } else {
  //             return k
  //           }
  //         }));

  //         console.log(arr)
  //         settilesArray(arr)
  //         break;

  //       case 'left':
  //         arr = tilesArray.map((elem: any, index: any) => {
  //           if (index === data.index) {
  //             return (elem.map((k: any, v: number) => {
  //               // if (index === data.index) {
  //               let r = Number(data.r) * (elem.length + 1 - v) / (elem.length + 1)
  //               let g = Number(data.g) * (elem.length + 1 - v) / (elem.length + 1)
  //               let b = Number(data.b) * (elem.length + 1 - v) / (elem.length + 1)
  //               const r1 = Number(k.topColor[0]) + Number(k.rightColor[0]) + Number(k.bottomColor[0]) + r
  //               const g1 = Number(k.topColor[1]) + Number(k.rightColor[1]) + Number(k.bottomColor[1]) + g
  //               const b1 = Number(k.topColor[2]) + Number(k.rightColor[2]) + Number(k.bottomColor[2]) + b
  //               const f = 255 / Math.max(r1, g1, b1, 255)
  //               const color = [r1 * f, g1 * f, b1 * f]
  //               currentColorMixArray.push({
  //                 color: color,
  //                 diff: calcDiff(color, targetColor),
  //                 tileAddress: [index, v]
  //               })
  //               return {
  //                 color: color,
  //                 topColor: k.topColor,
  //                 rightColor: k.rightColor,
  //                 bottomColor: k.bottomColor,
  //                 leftColor: [r, g, b],
  //                 diff: calcDiff(color, targetColor),
  //                 tileAddress: [index, v]
  //               }
  //               // return { ...k, 'color': [r1 * f, g1 * f, b1 * f], 'leftColor': [Number(data.r), Number(data.g), Number(data.b)] }
  //               // return { ...k, 'color': [r, g, b] }
  //               // } else {
  //               //   return k
  //               // }
  //               // return (
  //               //   index === data.index ? { ...k, 'color': [...data.color] } : k
  //               // )
  //             }))
  //           } else { return elem }
  //         });

  //         console.log(arr)
  //         settilesArray(arr)
  //         break;

  //       case 'right':
  //         arr = tilesArray.map((elem: any, index: any) => {
  //           if (index === data.index) {
  //             return (elem.map((k: any, v: number) => {
  //               // if (index === data.index) {
  //               let r = Number(data.r) * (elem.length + 1 - (elem.length - (v + 1))) / (elem.length + 1)
  //               let g = Number(data.g) * (elem.length + 1 - (elem.length - (v + 1))) / (elem.length + 1)
  //               let b = Number(data.b) * (elem.length + 1 - (elem.length - (v + 1))) / (elem.length + 1)
  //               const r1 = Number(k.topColor[0]) + r + Number(k.bottomColor[0]) + Number(k.leftColor[0])
  //               const g1 = Number(k.topColor[1]) + g + Number(k.bottomColor[1]) + Number(k.leftColor[1])
  //               const b1 = Number(k.topColor[2]) + b + Number(k.bottomColor[2]) + Number(k.leftColor[2])
  //               const f = 255 / Math.max(r1, g1, b1, 255)
  //               const color = [r1 * f, g1 * f, b1 * f]
  //               currentColorMixArray.push({
  //                 color: color,
  //                 diff: calcDiff(color, targetColor),
  //                 tileAddress: [index, v]
  //               })
  //               return {
  //                 color: color,
  //                 topColor: k.topColor,
  //                 rightColor: [r, g, b],
  //                 bottomColor: k.bottomColor,
  //                 leftColor: k.leftColor,
  //                 diff: calcDiff(color, targetColor),
  //                 tileAddress: [index, v]
  //               }
  //               // return { ...k, 'color': [r1 * f, g1 * f, b1 * f], 'rightColor': [Number(data.r), Number(data.g), Number(data.b)] }
  //               // return { ...k, 'color': [r, g, b] }
  //               // } else {
  //               //   return k
  //               // }
  //             }))
  //           } else { return elem }
  //         });

  //         console.log(arr)
  //         settilesArray(arr)
  //         break;

  //       default:
  //         break;
  //     }
  //     checkColorDiff(currentColorMixArray, arr)
  //     setmaxMoves(maxMoves - 1)
  //     if (maxMoves - 1 < 1) {
  //       // setOpenDialog(true);
  //       AlertDialogRef.current?.updateshowAlertDialog();
  //     }
  //   }
  // }

  // const checkColorDiff = (currentColorMixArray: any, arr: any) => {
  //   console.log('test', currentColorMixArray)
  //   // let closestColorObjectFromArr: any = []
  //   let closestColorObject = currentColorMixArray.reduce((x1: any, x2: any) => x1.diff < x2.diff ? x1 : x2)
  //   const y1 = closestColor?.diff - closestColorObject.diff;
  //   if ((y1 >= 0)) {
  //     setclosestColor(closestColorObject);
  //   } else if ((y1 < 0) && (currentColorMixArray.findIndex((elem: any) => elem.tileAddress[0] === closestColor?.tileAddress[0] && elem.tileAddress[1] === closestColor?.tileAddress[1]) >= 0)) {
  //     closestColorObject = [...arr].flat(2).reduce((x1, x2) => x1.diff < x2.diff ? x1 : x2);
  //     setclosestColor(closestColorObject);
  //   }
  //   if (closestColorObject?.diff < 10) {
  //     // setOpenDialog(true);
  //     AlertDialogRef.current?.updateshowAlertDialog();
  //   }
  // }


  // const dragStart = (e: any, draggedData?: any) => {
  //   console.log(e)
  //   console.log(draggedData)
  //   setdragColor(draggedData)
  // }

  // const dragDrop = (e: any, droppedContainer?: any) => {
  //   console.log(e)
  //   console.log(droppedContainer)
  //   droppedContainer['r'] = dragColor[0];
  //   droppedContainer['g'] = dragColor[1];
  //   droppedContainer['b'] = dragColor[2];
  //   e.target.setAttribute('style', `background: rgb(${droppedContainer['r']},${droppedContainer['g']},${droppedContainer['b']})`)
  //   renderColorToRowColumn(droppedContainer)
  // }

  // const dragOver = (e: any) => {
  //   e.preventDefault();
  //   return true;
  // }

  // const dragEnter = (e: any) => {
  //   e.preventDefault();
  //   return true;
  // }

  const calcDiff = (c1: any, c2: any) => {
    let r_diff = Math.pow((c1[0] - c2[0]), 2);
    let g_diff = Math.pow((c1[1] - c2[1]), 2);
    let b_diff = Math.pow((c1[2] - c2[2]), 2);
    return ((1 / 255) * (1 / (Math.sqrt(3))) * (Math.sqrt(r_diff + g_diff + b_diff))) * 100
  }


  // const roundTo2decimal = (n: number) => {
  //   return Math.round(n * 100) / 100;
  // }

  const upDateClosestColor = (value: any) => {
    setclosestColor(value);
    // DetailsRef.current?.updateClosestColor(value);
  }

  return (
    <Box sx={{ padding: 5 }}>
      <div>
        <Suspense>
          <AlertDialog
            ref={AlertDialogRef}
            targetColor={targetColor}
            closestColor={closestColor}
            resetGame={resetGame}
          >
          </AlertDialog>
        </Suspense>
      </div>
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Suspense>
            <Details
              userId={initialData?.userId}
              maxMoves={maxMoves}
              targetColor={targetColor}
              closestColor={closestColor}
            ></Details>
          </Suspense>
        </CardContent>
        <CardContent>
          <Suspense>
            <GameBoard
              ref={GameBoardRef}
              initTilesArray={tilesArray}
              initInitialCircleColor={initialCircleColor}
              initClosestColor={closestColor}
              initMaxMoves={maxMoves}
              targetColor={targetColor}
              showAlertDialog={() => AlertDialogRef.current?.updateshowAlertDialog()}
              updateClosestColor={(value: any) => upDateClosestColor(value)}
              upDateMaxMoves={(value: number) => setmaxMoves(value)}
            ></GameBoard>
          </Suspense>
          {/* {tilesArray?.map((k: any, v: number) => {
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
          })} */}
        </CardContent>
      </Card>

    </Box>
  );
}

export default App;
