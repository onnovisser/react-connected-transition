import React, { Component, forwardRef, useImperativeMethods } from 'react';
import renderer from 'react-test-renderer';
import ConnectedTransition from '../index';
import { transitions } from '../transitions';

/* eslint-disable */
class ClassComponent extends Component {
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

class OtherClassComponent extends Component {
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

const FunctionComponentWithRef = forwardRef((props, ref) => {
  useImperativeMethods(ref, () => ({
    getTransitionData() {
      return {
        baz: 'baz',
      };
    },
  }));

  return <div />;
});

function FunctionComponent(props) {
  return <div />;
}
/* eslint-enable */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const classComponentEnterSpy = jest.spyOn(
  ClassComponent.prototype,
  'componentWillEnter'
);
const classComponentLeaveSpy = jest.spyOn(
  ClassComponent.prototype,
  'componentWillLeave'
);
const otherClassComponentEnterSpy = jest.spyOn(
  OtherClassComponent.prototype,
  'componentWillEnter'
);
const otherClassComponentLeaveSpy = jest.spyOn(
  OtherClassComponent.prototype,
  'componentWillLeave'
);

const elementExpectedData = {
  foo: 'foo',
};
const otherClassComponentExpectedData = {
  bar: 'bar',
};
const functionComponentExpectedData = {
  baz: 'baz',
};

afterEach(() => {
  classComponentEnterSpy.mockReset();
  classComponentLeaveSpy.mockReset();
  otherClassComponentEnterSpy.mockReset();
  otherClassComponentLeaveSpy.mockReset();
});

describe('Connected Transition', () => {
  it("renders it's child", () => {
    const tree = renderer.create(
      <ConnectedTransition name="name">
        <ClassComponent />
      </ConnectedTransition>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('sets correct transition values on enter and exit', async () => {
    const tree = renderer.create(
      <ConnectedTransition name="name">
        <ClassComponent />
      </ConnectedTransition>
    );

    await expect(transitions.name.enter.promise).resolves.toEqual(
      elementExpectedData
    );
    expect(classComponentEnterSpy).not.toHaveBeenCalled();
    await sleep(100);

    tree.unmount();

    await expect(transitions.name.exit.promise).resolves.toEqual(
      elementExpectedData
    );
    expect(classComponentLeaveSpy).not.toHaveBeenCalled();
  });

  it('works with a function component with forwarded ref', async () => {
    const tree = renderer.create(
      <ConnectedTransition name="name">
        <FunctionComponentWithRef />
      </ConnectedTransition>
    );

    await expect(transitions.name.enter.promise).resolves.toEqual(
      functionComponentExpectedData
    );
    expect(classComponentEnterSpy).not.toHaveBeenCalled();
    await sleep(100);

    tree.unmount();

    await expect(transitions.name.exit.promise).resolves.toEqual(
      functionComponentExpectedData
    );
    expect(classComponentLeaveSpy).not.toHaveBeenCalled();
  });

  it('cleans up transitions after a timeout', done => {
    renderer.create(
      <ConnectedTransition name="name">
        <ClassComponent />
      </ConnectedTransition>
    );

    expect(transitions.name).toBeDefined();
    setTimeout(() => {
      expect(transitions.name).toBeUndefined();
      done();
    }, 100);
  });

  it("doesn't call exit on mount", async () => {
    renderer.create(
      <div>
        <ConnectedTransition name="name" exit>
          <ClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name">
          <ClassComponent />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    expect(classComponentEnterSpy).not.toHaveBeenCalled();
    expect(classComponentLeaveSpy).not.toHaveBeenCalled();
  });

  it('handles entering before exiting', async () => {
    const tree = renderer.create(
      <div>
        <ConnectedTransition name="name" key="1">
          <ClassComponent />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    tree.update(
      <div>
        <ConnectedTransition name="name" key="2">
          <OtherClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="1" exit>
          <ClassComponent />
        </ConnectedTransition>
      </div>
    );

    await transitions.name.enter.promise;
    await transitions.name.exit.promise;
    expect(otherClassComponentEnterSpy).toBeCalledWith(
      elementExpectedData,
      otherClassComponentExpectedData
    );
    expect(classComponentLeaveSpy).toBeCalledWith(
      elementExpectedData,
      otherClassComponentExpectedData
    );
  });

  it('handles entering after exiting', async () => {
    const tree = renderer.create(
      <div>
        <ConnectedTransition name="name" key="1">
          <ClassComponent />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    tree.update(
      <div>
        <ConnectedTransition name="name" key="1" exit>
          <ClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="2">
          <OtherClassComponent />
        </ConnectedTransition>
      </div>
    );

    await transitions.name.enter.promise;
    await transitions.name.exit.promise;
    expect(otherClassComponentEnterSpy).toBeCalledWith(
      elementExpectedData,
      otherClassComponentExpectedData
    );
    expect(classComponentLeaveSpy).toBeCalledWith(
      elementExpectedData,
      otherClassComponentExpectedData
    );
  });

  it('Merges transition data', async () => {
    function getTransitionData() {
      return {
        baz: 'baz',
      };
    }

    const expectedData = {
      baz: 'baz',
      ...elementExpectedData,
    };

    const tree = renderer.create(
      <div>
        <ConnectedTransition
          name="name"
          getTransitionData={getTransitionData}
          key="1"
        >
          <ClassComponent />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    tree.update(
      <div>
        <ConnectedTransition
          name="name"
          getTransitionData={getTransitionData}
          key="1"
          exit
        >
          <ClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="2">
          <OtherClassComponent />
        </ConnectedTransition>
      </div>
    );

    await transitions.name.enter.promise;
    await transitions.name.exit.promise;
    expect(otherClassComponentEnterSpy).toBeCalledWith(
      expectedData,
      otherClassComponentExpectedData
    );
  });

  it('Allows for passive listeners', async () => {
    const enter = jest.fn();
    const leave = jest.fn();

    const tree = renderer.create(
      <div>
        <ConnectedTransition name="name" key="1">
          <ClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name" passive onLeave={leave} key="3">
          <FunctionComponent />
        </ConnectedTransition>
      </div>
    );

    await sleep(100);

    tree.update(
      <div>
        <ConnectedTransition name="name" key="2">
          <OtherClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name" key="1" exit>
          <ClassComponent />
        </ConnectedTransition>
        <ConnectedTransition name="name" passive onEnter={enter} key="4">
          <FunctionComponent />
        </ConnectedTransition>
      </div>
    );

    await transitions.name.enter.promise;
    await transitions.name.exit.promise;
    expect(enter).toBeCalledWith(
      elementExpectedData,
      otherClassComponentExpectedData
    );
    expect(leave).toBeCalledWith(
      elementExpectedData,
      otherClassComponentExpectedData
    );
  });
});
