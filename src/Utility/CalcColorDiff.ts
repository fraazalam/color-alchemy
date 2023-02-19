export const calcDiff = (c1: any, c2: any) => {
    let r_diff = Math.pow((c1[0] - c2[0]), 2);
    let g_diff = Math.pow((c1[1] - c2[1]), 2);
    let b_diff = Math.pow((c1[2] - c2[2]), 2);
    return ((1 / 255) * (1 / (Math.sqrt(3))) * (Math.sqrt(r_diff + g_diff + b_diff))) * 100
}