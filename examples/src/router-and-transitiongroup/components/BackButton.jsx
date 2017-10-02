import { Link } from 'react-router-dom';
import styled from 'react-emotion';

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0 10px;
  position: absolute;
  left: 10px;
  top: 10px;
  background-color: white;
  line-height: 18px;
  height: 18px;
  font-size: 13px;
  border-radius: 9px;
  z-index: 10;

  &::before {
    content: '< ';
  }
`;

export default BackButton;
