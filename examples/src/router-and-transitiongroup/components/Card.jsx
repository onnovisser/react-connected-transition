import React, { Component } from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'react-emotion';
import ConnectedTransition from 'react-connected-transition';
import withTransition from '../containers/withTransition';
import Text from './Text';
import Image from './Image';
import TransitionPosition from '../components/TransitionPosition';
import TransitionPositionAndScale from '../components/TransitionPositionAndScale';


/**
 * A Media Query utility for CSS-in-JS / React
 * 
 * const Styled = styled.div`
 *   display: block;
 *   ${mq('largeUp')} {
 *     border: 3px solid tomato;
 *   }
 * `;
 * 
 * <div>
 *   {isMQ('largeUp') && <SomeComponent />}
 *   {isMQ({ min: 300 }) && <SomeOtherComponent />}
 * </div>
 * 
 */

const breakpoints = {
  small: 400,
  medium: 600,
  large: 900,
  xlarge: 1200,
};

const mediaRanges = {
  // Ranges starting form a breakpoint
  smallUp: { min: 'small' },
  mediumUp: { min: 'medium' },
  largeUp: { min: 'large' },
  xlargeUp: { min: 'xlarge' },

  // Ranges between breakpoints
  smallToMedium: { min: 'small', max: 'medium' },
  mediumToLarge: { min: 'medium', max: 'large' },

  // Ranges up to a breakpoint
  smallDown: { max: 'small' },
  mediumDown: { max: 'medium' },
  largeDown: { max: 'large' },
};

/**
 * Creates a function for a given range to use with CSS-in-JS
 * 
 * @param {string|Object} range - A key used in the media range config or a custom range object
 * @returns {Function}
 * @example
 * mq('largeUp')
 * mq({ min: 900 })
 * mq({ min: 300, max: 900 })
 */
function mq(range) {
  return () => `@media ${getMQ(range)}`;
}

/**
 * Checks the window width against a media range.
 * 
 * @param {string|Object} range - A key used in the media range config or a custom range object
 * @returns {bool} Whether the page width is within the range
 */
function isMQ(range) {
  return window.matchMedia(getMQ(range)).matches;
}

/**
 * Creates a CSS media query string for a given range
 * 
 * @param {string|Object} range - A key used in the media range config or a custom range object
 * @returns {string}
 */
function getMQ(range) {
  const [min, max] = getMQValues(range);
  return `(min-width: ${min}px) and (max-width: ${max}px)`;
}

/**
 * Gets the min and max values for use in a media query
 * 
 * @param {string|Object} range - A key used in the media range config or a custom range object
 * @returns {number[]} Array with the min and max
 */
function getMQValues(range) {
  let min, max;

  if (typeof range === 'object') {
    min = range.min || 0;
    max = range.max || 99999;
  } else {
    const minKey = mediaRanges[range].min;
    const maxKey = mediaRanges[range].max;
    min = breakpoints[minKey] || 0;
    max = breakpoints[maxKey] || 99999;
  }

  return [min, max];
}

class Card extends Component {
  static propTypes = {
    id: string.isRequired,
    title: string.isRequired,
    image: string.isRequired,
    transitionState: string.isRequired, // Supplied by withTransition HOC
  };

  state = {
    transitionEnter: false,
  };

  onTransitionEnter = (from, to) => {
    if (this.props.id === to.id) {
      this.setState({ transitionEnter: true });
    }
  };

  getID = () => ({
    id: this.props.id,
  });

  render() {
    const { id, title, image, transitionState } = this.props;
    const pageExit =
      transitionState === 'exiting' || transitionState === 'exited';

    return (
      <CardLink
        to={`/detail/${id}`}
        transitionState={transitionState}
        transitionEnter={this.state.transitionEnter}
      >
        <div className={imageClass}>
          <ConnectedTransition
            name={`image${id}`}
            exit={pageExit}
            onEnter={this.onTransitionEnter}
            getTransitionData={this.getID}
          >
            <TransitionPositionAndScale>
              <Image src={image} />
            </TransitionPositionAndScale>
          </ConnectedTransition>
        </div>

        <div className={textClass}>
          <ConnectedTransition name={`title${id}`} exit={pageExit}>
            <TransitionPosition>
              <Text heading>
                {title}
              </Text>
            </TransitionPosition>
          </ConnectedTransition>
        </div>
      </CardLink>
    );
  }
}

const transitionStyles = {
  entering: css`opacity: 1`,
  entered: css`opacity: 1`,
};

const CardLink = styled(Link)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 5px 5px 40px -1px rgba(0,0,0,.2);
  opacity: 0;
  transition: opacity 400ms ease;

  &:nth-child(2n) {
    flex-direction: row-reverse;
  }

  ${p => transitionStyles[p.transitionState]};

  // ${p => p.transitionEnter && css`transition: none`};

  @media (min-width: 600px) {
    height: 25vw;
  }
`;

const imageClass = css`
  width: 100%;
  height: 50vw;

  @media (min-width: 600px) {
    height: auto;
    width: 40%;
  }
`;

const textClass = css`
  width: 100%;
  min-height: 25vw;
  padding: 4vw;
  
  @media (min-width: 600px) {
      width: 60%;
    }
`;

export default withTransition(Card);
