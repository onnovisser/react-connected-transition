# react-connected-transition

[![npm version](https://badge.fury.io/js/react-connected-transition.svg)](https://badge.fury.io/js/react-connected-transition)
[![Build Status](https://travis-ci.org/onnovisser/react-connected-transition.svg?branch=master)](https://travis-ci.org/onnovisser/react-connected-transition)
[![codecov](https://codecov.io/gh/onnovisser/react-connected-transition/branch/master/graph/badge.svg)](https://codecov.io/gh/onnovisser/react-connected-transition)
![gzip size](http://img.badgesize.io/https://unpkg.com/react-connected-transition/dist/react-connected-transition.js?compression=gzip&label=gzip%20size)

A React component that passes along data between leaving and entering components in order to easily animate the transition between them.

* * *

## Examples

Coming soon!

## Installation

```bash
npm install -S react-connected-transition
```

> Note: The code uses promises. If you need to support older browsers, be sure to include a polyfill.

## Usage

Import the `ConnectedTransition` component where you want to use it.

```js
import ConnectedTransition from 'react-connected-transition';
```

Wrap the component 

```jsx
<ConnectedTransition name="uniqueName1">
  <SomeComponent />
</ConnectedTransition>
```

When the `ConnectedTransition` unmounts and one with the same name mounts at the same time, the child of each will have its `componentWillLeave` and `componentWillEnter` called respectively.

* * *

## Api

### Props

* #### children
  `PropTypes.instanceOf(Component)`
  
  Component you intend to animate.

  The following hooks are called on them:

   - [`componentWillEnter()`](#componentwillenter) 
   - [`componentWillLeave()`](#componentwillleave)
   - [`getTransitionData()`](#gettransitiondata)

  *The child components of `ConnectedTransition`'s with the same name don't have to be of the same type*

* #### name
  
  `PropTypes.string`

  Unique name to find the related transitioning component.

* #### exit
  
  `PropTypes.bool`

  By default, the `ConnectedTransition` component waits for its child to unmount before sending its data the mounting component with the same name. When using `react-transition-group`, a component will stay mounted for the duration of the transition before unmounting. To tell the `ConnectedTransition` to expect a transtion, pass `exit={true}` when exiting.

* * *

## Reference

### `componentWillEnter()`

```js
componentWillEnter(from, to)
```

This is called on components whose `ConnectedTransition` parent has mounted and has its `exit`-prop not set to `true`. It is only called when, at the same time, a `ConnectedTransition` with the same name unmounts or has its `exit`-prop set to `true`.

`from` and `to` have the following shape:

```js
{
  bounds, // as returned from node.getBoundingClientRect()
  style, // as returned from window.getComputedStyle(node)
  data, // additional data received from getTransitionData() hook
}
```

The bounds and style of `to` are those of the component this method is called upon.

* * *

### `componentWillLeave()`

```js
componentWillLeave(from, to)
```

This is called on components whose `ConnectedTransition` parent has its `exit`-prop set to `true`. It is only called when, at the same time, a `ConnectedTransition` with the same name has mounted or has its `exit`-prop set to `false`. **It is not called when unmounting**, as a `ConnectedTransition` waits for another to enter before it handles the transition, at which point the exiting component may already have unmounted.

The bounds and style of `from` are those of the component this method is called upon.

* * *

### `getTransitionData()`

```js
getTransitionData()
```

This is called right before `componentWillLeave()` and `componentWillEnter()`. Return additional data here to pass to those methods
