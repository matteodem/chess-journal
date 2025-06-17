import React, { useEffect, useRef } from 'react';
import Chessboard from 'chessboardjsx';

export const FenChessboard = ({ fen, orientation }) => {
  return <Chessboard position={fen} width={300} orientation={orientation} />
};
