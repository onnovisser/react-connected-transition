import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import ConnectedTransition from '../index';
import transitions from '../transitions';

/* eslint-disable */
class Element extends Component {
  componentWillEnter() {}

  componentWillLeave() {}

  getTransitionData() {
    return {
      foo: 'foo',
    };
  }

  render() {
    return <div />;
  }
}

class OtherElement extends Component {
  componentWillEnter() {}

  componentWillLeave() {}

  getTransitionData() {
    return {
      bar: 'bar',
    };
  }

  render() {
    return <div />;
  }
}
/* eslint-enable */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const elementEnterSpy = jest.spyOn(Element.prototype, 'componentWillEnter');
const elementLeaveSpy = jest.spyOn(Element.prototype, 'componentWillLeave');
const otherElementEnterSpy = jest.spyOn(
  OtherElement.prototype,
  'componentWillEnter'
);
const otherElementLeaveSpy = jest.spyOn(
  OtherElement.prototype,
  'componentWillLeave'
);

const elementExpectedData = {
  foo: 'foo',
};
const otherElementExpectedData = {
  bar: 'bar',
};

afterEach(() => {
  elementEnterSpy.mockReset();
  elementLeaveSpy.mockReset();
  otherElementEnterSpy.mockReset();
  otherElementLeaveSpy.mockReset();
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

    await expect(transitions.name.enter.promise).resolves.toEqual(
      elementExpectedData
    );
    expect(elementEnterSpy).not.toHaveBeenCalled();
    await sleep(100);

    tree.unmount();

    await expect(transitions.name.exit.promise).resolves.toEqual(
      elementExpectedData
    );
    expect(elementLeaveSpy).not.toHaveBeenCalled();
  });

  it('cleans up transitions after a timeout', done => {
    renderer.create(
      <ConnectedTransition name="name">
        <Element />
      </ConnectedTransition>
    );

    expect(transitions.name).toBeDefined();
    setTimeout(() => {
      expect(transitions.name).toBeUndefined();
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
          <OtherElement />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="1" exit>
          <Element />
        </ConnectedTransition>
      </div>
    );

    await transitions.name.enter.promise;
    await transitions.name.exit.promise;
    expect(otherElementEnterSpy).toBeCalledWith(
      elementExpectedData,
      otherElementExpectedData
    );
    expect(elementLeaveSpy).toBeCalledWith(
      elementExpectedData,
      otherElementExpectedData
    );
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
          <OtherElement />
        </ConnectedTransition>
      </div>
    );

    await transitions.name.enter.promise;
    await transitions.name.exit.promise;
    expect(otherElementEnterSpy).toBeCalledWith(
      elementExpectedData,
      otherElementExpectedData
    );
    expect(elementLeaveSpy).toBeCalledWith(
      elementExpectedData,
      otherElementExpectedData
    );
  });
});
