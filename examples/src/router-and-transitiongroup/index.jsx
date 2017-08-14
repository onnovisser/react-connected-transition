import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Demo from './Demo';
import './index.html';

render(<Demo />, document.getElementById('root'));
