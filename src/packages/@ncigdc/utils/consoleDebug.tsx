import { IS_DEV } from '@ncigdc/utils/constants';

type TConsoleDebug = (log: string) => void;

const consoleDebug: TConsoleDebug = log => {
  if (IS_DEV) {
    console.log(log);
  }
};

export default consoleDebug;
