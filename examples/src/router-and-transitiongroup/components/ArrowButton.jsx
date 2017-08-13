import { Link } from 'react-router-dom';
import styled from 'emotion/react';

const ArrowButton = styled(Link)`
  display: block;
  width: 60px;
  height: 60px;
  position: absolute;
  right: ${p => p.flipped ? '0' : 'auto'};
  top: calc(50% - 20px);
  transform: ${p => p.flipped ? 'scaleX(-1)' : 'none'};  
  z-index: 10;

  &::before {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    border-width: 0 0 3px 3px;
    border-color: white;
    border-style: solid;
    transform: translateX(15px) rotate(45deg);
    transform-origin: 13px 30px;
  }
`;

export default ArrowButton;
