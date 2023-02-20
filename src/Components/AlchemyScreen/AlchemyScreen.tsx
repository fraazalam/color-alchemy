/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, lazy, useRef, Suspense } from 'react'
import './AlchemyScreen.css';
import { initResp, RespType } from '../../services/api'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { calcDiff } from '../../Utility/CalcColorDiff';
import { generateMatrix } from './AlchemyScreenScript';
const Details = lazy(() => import('../Details/Details').then((module) => ({ default: module.default })));
const AlertDialog = lazy(() => import('../AlertDialog/AlertDialog').then((module) => ({ default: module.default })));
const GameBoard = lazy(() => import('../GameBoard/GameBoard').then(module => ({ default: module.default })))

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
const AlchemyScreen = () => {

    const AlertDialogRef = useRef<any>();
    const GameBoardRef = useRef<any>();
    const [initialCircleColor, setinitialCircleColor] = useState([0, 0, 0])
    const [initialData, setInitialData] = useState<RespType>()
    const [tilesArray, settilesArray] = useState<any>()
    const [maxMoves, setmaxMoves] = useState(0)
    const [targetColor, settargetColor] = useState(Array(3).fill(0))
    const [closestColor, setclosestColor] = useState({ color: [0, 0, 0], diff: 0, tileAddress: [0, 0] })

    useEffect(() => {
        resetGame();
    }, [])

    const resetGame = () => {
        initResp(initialData?.userId).then((value: any) => {
            const data: any = value;
            if (initialData?.userId) { resetState(data) };
            createSquareTilesArray(data);
        }).catch((err: any) => {
        })
    }

    const resetState = async (data: any) => {
        setinitialCircleColor(initialState.initialCircleColor);
        setInitialData(initialState.initialData);
        settilesArray(initialState.tilesArray);
        setmaxMoves(initialState.maxMoves);
        settargetColor(initialState.targetColor);
        setclosestColor({ color: [0, 0, 0], diff: 0, tileAddress: [0, 0] });
        AlertDialogRef.current?.updateshowAlertDialog(false);
    }

    const createSquareTilesArray = (data: any) => {
        let arr = generateMatrix(data)
        settilesArray(arr)
        setInitialData(data)
        setmaxMoves(data.maxMoves)
        setinitialCircleColor([0, 0, 0])
        settargetColor([...data.target])
        const diff = calcDiff(data.target, [0, 0, 0])
        setclosestColor({ color: [0, 0, 0], diff: diff, tileAddress: [0, 0] })
        GameBoardRef.current?.reset({ arr: arr, closestColor: closestColor, initialCircleColor: [0, 0, 0], maxMoves: data.maxMoves })
    }

    const upDateClosestColor = (value: any) => {
        setclosestColor(value);
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
                            showAlertDialog={() => AlertDialogRef.current?.updateshowAlertDialog(true)}
                            updateClosestColor={(value: any) => upDateClosestColor(value)}
                            upDateMaxMoves={(value: number) => setmaxMoves(value)}
                        ></GameBoard>
                    </Suspense>
                </CardContent>
            </Card>

        </Box>
    )
}

export default AlchemyScreen;
