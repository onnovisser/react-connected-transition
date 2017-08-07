import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import ConnectedTransition, { __transitions } from '../index';

class Element extends Component {
  render() {
    return <div />;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const enterSpy = jest.spyOn(ConnectedTransition.prototype, '_callEnter');
const leaveSpy = jest.spyOn(ConnectedTransition.prototype, '_callLeave');

jest.mock('react-dom', () => ({
  findDOMNode: () => ({
    getBoundingClientRect: () => {},
  }),
}));

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({}),
});

afterEach(() => {
  leaveSpy.mockReset();
  enterSpy.mockReset();
});

describe('Connected Transition', () => {
  it("renders it's child", () => {
    const tree = renderer.create(
      <ConnectedTransition name="name">
        <Element />
      </ConnectedTransition>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('sets correct transition values on enter and exit', async () => {
    const tree = renderer.create(
      <ConnectedTransition name="name">
        <Element />
      </ConnectedTransition>
    );

    await expect(__transitions.name.enter.promise).resolves.toEqual({
      bounds: undefined,
      style: {},
    });
    expect(enterSpy).not.toHaveBeenCalled();
    await sleep(100);

    tree.unmount();

    await expect(__transitions.name.exit.promise).resolves.toEqual({
      bounds: undefined,
      style: {},
    });
    expect(leaveSpy).not.toHaveBeenCalled();
  });

  it('cleans up transitions after a timeout', done => {
    renderer.create(
      <ConnectedTransition name="name">
        <Element />
      </ConnectedTransition>
    );

    expect(__transitions.name).toBeDefined();
    setTimeout(() => {
      expect(__transitions.name).toBeUndefined();
      done();
    }, 100);
  });

  it('handles entering before exiting', async () => {
    const tree = renderer.create(
      <div>
        <ConnectedTransition name="name" key="1">
          <Element />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    tree.update(
      <div>
        <ConnectedTransition name="name" key="2">
          <Element />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="1" exit>
          <Element />
        </ConnectedTransition>
      </div>
    );

    await __transitions.name.enter.promise;
    expect(enterSpy).toHaveBeenCalled();
    expect(leaveSpy).toHaveBeenCalled();
  });

  it('handles entering after exiting', async () => {
    const tree = renderer.create(
      <div>
        <ConnectedTransition name="name" key="1">
          <Element />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    tree.update(
      <div>
        <ConnectedTransition name="name" key="1" exit>
          <Element />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="2">
          <Element />
        </ConnectedTransition>
      </div>
    );

    await __transitions.name.enter.promise;
    expect(enterSpy).toHaveBeenCalled();
    expect(leaveSpy).toHaveBeenCalled();
  });
});
