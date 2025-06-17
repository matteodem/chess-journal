import React, { useEffect, useRef } from 'react';
import Chessboard from 'chessboardjsx';

export const FenChessboard = ({ fen }) => {
  return <Chessboard position={fen} width={300} />
};
