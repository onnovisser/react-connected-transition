import React from 'react';
import { node } from 'prop-types';
import { css } from 'emotion/react';

CardTitle.propTypes = {
  children: node.isRequired
}

function CardTitle({ children }) {
    return (
      <div className={className}>
        {children}
      </div>
    );
}

const className = css`
  padding: 4vw;
  width: 70%;
  position: relative;
`

export default CardTitle;
