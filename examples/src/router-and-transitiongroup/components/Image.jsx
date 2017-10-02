import styled from 'react-emotion';

const Image = styled.div`
  width: 100%;
  height: 100%;
  background: no-repeat center/cover url(${p => p.src});
`;

export default Image;
