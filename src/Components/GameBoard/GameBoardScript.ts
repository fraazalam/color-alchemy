import { calcDiff } from "../../Utility/CalcColorDiff";

export const renderColor = (data: any, tilesArray: any, targetColor: any) => {
  let arr: any = [];
  const currentColorMixArray: any = [];
  switch (data.start) {
    case "top":
      arr = tilesArray.map((elem: any, index: any) =>
        elem.map((k: any, v: number) => {
          if (v === data.index) {
            let r =
              (Number(data.r) * (tilesArray.length + 1 - index)) /
              (tilesArray.length + 1);
            let g =
              (Number(data.g) * (tilesArray.length + 1 - index)) /
              (tilesArray.length + 1);
            let b =
              (Number(data.b) * (tilesArray.length + 1 - index)) /
              (tilesArray.length + 1);
            const r1 =
              r +
              Number(k.rightColor[0]) +
              Number(k.bottomColor[0]) +
              Number(k.leftColor[0]);
            const g1 =
              g +
              Number(k.rightColor[1]) +
              Number(k.bottomColor[1]) +
              Number(k.leftColor[1]);
            const b1 =
              b +
              Number(k.rightColor[2]) +
              Number(k.bottomColor[2]) +
              Number(k.leftColor[2]);
            const f = 255 / Math.max(r1, g1, b1, 255);
            const color = [r1 * f, g1 * f, b1 * f];
            currentColorMixArray.push({
              color: color,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            });
            return {
              color: color,
              topColor: [r, g, b],
              rightColor: k.rightColor,
              bottomColor: k.bottomColor,
              leftColor: k.leftColor,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            };
          } else {
            return k;
          }
        })
      );
      break;

    case "bottom":
      arr = tilesArray.map((elem: any, index: any) =>
        elem.map((k: any, v: number) => {
          if (v === data.index) {
            let r =
              (Number(data.r) *
                (tilesArray.length + 1 - (tilesArray.length - (index + 1)))) /
              (tilesArray.length + 1);
            let g =
              (Number(data.g) *
                (tilesArray.length + 1 - (tilesArray.length - (index + 1)))) /
              (tilesArray.length + 1);
            let b =
              (Number(data.b) *
                (tilesArray.length + 1 - (tilesArray.length - (index + 1)))) /
              (tilesArray.length + 1);
            const r1 =
              Number(k.topColor[0]) +
              Number(k.rightColor[0]) +
              r +
              Number(k.leftColor[0]);
            const g1 =
              Number(k.topColor[1]) +
              Number(k.rightColor[1]) +
              g +
              Number(k.leftColor[1]);
            const b1 =
              Number(k.topColor[2]) +
              Number(k.rightColor[2]) +
              b +
              Number(k.leftColor[2]);
            const f = 255 / Math.max(r1, g1, b1, 255);
            const color = [r1 * f, g1 * f, b1 * f];
            currentColorMixArray.push({
              color: color,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            });
            return {
              color: color,
              topColor: k.topColor,
              rightColor: k.rightColor,
              bottomColor: [r, g, b],
              leftColor: k.leftColor,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            };
          } else {
            return k;
          }
        })
      );
      break;

    case "left":
      arr = tilesArray.map((elem: any, index: any) => {
        if (index === data.index) {
          return elem.map((k: any, v: number) => {
            // if (index === data.index) {
            let r =
              (Number(data.r) * (elem.length + 1 - v)) / (elem.length + 1);
            let g =
              (Number(data.g) * (elem.length + 1 - v)) / (elem.length + 1);
            let b =
              (Number(data.b) * (elem.length + 1 - v)) / (elem.length + 1);
            const r1 =
              Number(k.topColor[0]) +
              Number(k.rightColor[0]) +
              Number(k.bottomColor[0]) +
              r;
            const g1 =
              Number(k.topColor[1]) +
              Number(k.rightColor[1]) +
              Number(k.bottomColor[1]) +
              g;
            const b1 =
              Number(k.topColor[2]) +
              Number(k.rightColor[2]) +
              Number(k.bottomColor[2]) +
              b;
            const f = 255 / Math.max(r1, g1, b1, 255);
            const color = [r1 * f, g1 * f, b1 * f];
            currentColorMixArray.push({
              color: color,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            });
            return {
              color: color,
              topColor: k.topColor,
              rightColor: k.rightColor,
              bottomColor: k.bottomColor,
              leftColor: [r, g, b],
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            };
          });
        } else {
          return elem;
        }
      });
      break;

    case "right":
      arr = tilesArray.map((elem: any, index: any) => {
        if (index === data.index) {
          return elem.map((k: any, v: number) => {
            let r =
              (Number(data.r) * (elem.length + 1 - (elem.length - (v + 1)))) /
              (elem.length + 1);
            let g =
              (Number(data.g) * (elem.length + 1 - (elem.length - (v + 1)))) /
              (elem.length + 1);
            let b =
              (Number(data.b) * (elem.length + 1 - (elem.length - (v + 1)))) /
              (elem.length + 1);
            const r1 =
              Number(k.topColor[0]) +
              r +
              Number(k.bottomColor[0]) +
              Number(k.leftColor[0]);
            const g1 =
              Number(k.topColor[1]) +
              g +
              Number(k.bottomColor[1]) +
              Number(k.leftColor[1]);
            const b1 =
              Number(k.topColor[2]) +
              b +
              Number(k.bottomColor[2]) +
              Number(k.leftColor[2]);
            const f = 255 / Math.max(r1, g1, b1, 255);
            const color = [r1 * f, g1 * f, b1 * f];
            currentColorMixArray.push({
              color: color,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            });
            return {
              color: color,
              topColor: k.topColor,
              rightColor: [r, g, b],
              bottomColor: k.bottomColor,
              leftColor: k.leftColor,
              diff: calcDiff(color, targetColor),
              tileAddress: [index, v],
            };
          });
        } else {
          return elem;
        }
      });
      break;

    default:
      break;
  }

  return { arr: arr, currentColorMixArray: currentColorMixArray };
};
