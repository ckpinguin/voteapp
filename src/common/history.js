// https://github.com/rackt/react-router/blob/master/docs/advanced/NavigatingOutsideOfComponents.md

import { browserHistory } from 'react-router';

const history = typeof window !== 'undefined' ? browserHistory : undefined;

export default history;
