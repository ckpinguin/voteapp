// https://github.com/rackt/react-router/blob/master/docs/advanced/NavigatingOutsideOfComponents.md

//import { browserHistory } from 'react-router';
import { createHistory, createMemoryHistory } from 'history';

const history = typeof window !== 'undefined' ? createHistory() : createMemoryHistory();

export default history;
