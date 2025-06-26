import React, { useEffect, useRef } from 'react';
import Chessboard from 'chessboardjsx';

export const FenChessboard = ({ fen, orientation, isLarge }) => {
  return <Chessboard position={fen} width={isLarge ? 450 : 300} orientation={orientation} />
};
