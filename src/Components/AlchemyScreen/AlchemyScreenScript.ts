import { calcDiff } from "../../Utility/CalcColorDiff";

export const generateMatrix = (data: any) => {
    return Array.from(Array(data.height), (val, index) =>
        Array.from(Array(data.width), (k, v) => ({
            color: [0, 0, 0],
            topColor: [0, 0, 0],
            rightColor: [0, 0, 0],
            bottomColor: [0, 0, 0],
            leftColor: [0, 0, 0],
            diff: calcDiff([0, 0, 0], data.target),
            tileAddress: [index, v],
        }))
    );
};
export const resetState1 = async (
    data: any,
    initialState: any,
    setinitialCircleColor: any,
    setInitialData: any,
    settilesArray: any,
    setmaxMoves: any,
    settargetColor: any,
    setclosestColor: any,
    AlertDialogRef: any,
    GameBoardRef: any,
    ) => {
    setinitialCircleColor(initialState.initialCircleColor);
    setInitialData(data)
    settilesArray(initialState.tilesArray);
    setmaxMoves(data.maxMoves)
    settargetColor([...data.target])
    setclosestColor(initialState.closestColor);
    AlertDialogRef.current?.updateshowAlertDialog(false);
    createSquareTilesArray(data, settilesArray, setclosestColor, GameBoardRef);
}

const createSquareTilesArray = (data: any, settilesArray: any, setclosestColor: any, GameBoardRef: any) => {
    let arr = generateMatrix(data)
    settilesArray(arr)
    const diff = calcDiff(data.target, [0, 0, 0])
    const tempClosestColor = { color: [0, 0, 0], diff: diff, tileAddress: [0, 0] }
    setclosestColor(tempClosestColor)
    GameBoardRef.current?.reset({ arr: arr, closestColor: tempClosestColor, initialCircleColor: [0, 0, 0], maxMoves: data.maxMoves })
}