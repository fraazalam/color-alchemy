import React from 'react';
import { render } from "@testing-library/react"
import Details from "./Details"

test('Details', () => { 
    render(<Details userId={'test'} maxMoves={0} targetColor={[0, 0, 0]} closestColor={{ color: [0, 0, 0], diff: 0, tileAddress: [0, 0] }} />)
 })