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