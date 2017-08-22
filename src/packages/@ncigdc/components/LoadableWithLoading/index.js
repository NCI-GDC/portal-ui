import Loadable from 'react-loadable';
import Loading from './Loading';

const LoadableWithLoading = options =>
  Loadable({
    loading: Loading,
    ...options,
  });

export default LoadableWithLoading;
