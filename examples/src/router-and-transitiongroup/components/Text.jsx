import styled, { css } from 'emotion/react';

const defaultStyles = css`
`;

const headingStyles = css`
  font-weight: 300;
  font-size: calc(20px + 2vw);
`;

const Text = styled.div`${p => (p.heading ? headingStyles : defaultStyles)};`;

export default Text;