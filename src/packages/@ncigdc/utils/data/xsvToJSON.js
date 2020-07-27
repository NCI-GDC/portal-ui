import { IS_DEV } from '@ncigdc/utils/constants';

const timer = (processName, action) => console[`time${action || ''}`](processName);

const rowFormatter = (headers = [], headerFilters = [], initial = {}) => row =>
  headers.reduce(
    (objectifiedRow, header, headerIndex) => (
      headerFilters.length && !headerFilters.includes(header)
        ? objectifiedRow
        : ({
          ...objectifiedRow,
          [header]: row[headerIndex],
        })
    ),
    initial,
  );

export const wholeXSVtoJSON = (
  processName, // caller component's name
  headerFilters = [], // if we want to filter columns; optional
  separator = '\t', // TSV by default; optional
) => (
  source, // xsv string
) => {
  const rows = source.split('\n');
//
  const headers = rows.shift()
    .toLowerCase()
    .split(separator);

  return rows
    .map(rowSource => rowSource.split(separator))
    .map(rowFormatter(
      headers,
      headerFilters,
      {},
    ));
};

export const streamedXSVtoJSON = (
  updateResults, // to update state elsewhere
  headerFilters = [], // if we want to filter columns
  separator = '\t', // TSV by default
) => {
  const cache = {
    headers: [],
    pendingRow: '',
  };

  const rowStrFormatter = rowStr => [
    rowFormatter(
      cache.headers,
      headerFilters,
      {},
    )(rowStr.split(separator)),
  ];

  const setPendingTo = newPending => {
    cache.pendingRow = newPending;
  };

  const partialChunkHandler = headers => (
    (acc, rowStr) => (
      // ideally, for most rows
      rowStr.split(separator).length === headers.length
        ? acc.concat(rowStrFormatter(rowStr))

      // or it could just be what's missing from the pending
        : cache.pendingRow.concat(rowStr).split(separator).length === headers.length
          ? acc.concat(rowStrFormatter(
            cache.pendingRow.concat(rowStr),
            setPendingTo(''), // not forgetting to clear the cached pending row
          ))

      // or it is a last, partial row
        : (
          setPendingTo(cache.pendingRow.concat(rowStr)),
          acc
        )
    )
  );

  return (decodedStreamChunk, next) => {
    if (decodedStreamChunk) {
      const rows = decodedStreamChunk.split('\n');

      const headers = cache.headers.length
        ? cache.headers // use the cached values
        : cache.headers.push( // sets the cache, and then use it
          ...rows.shift() // this will only happen with the first chunk
            .toLowerCase()
            .split(separator),
        ) && cache.headers;

      const handleChunks = partialChunkHandler(headers, cache.pendingRow);

      // update state, then get the next chunk
      return updateResults(rows.reduce(handleChunks, []), next);
    }
    // no chunks to process??
    throw new Error('there was nothing to parse');
  };
};

export const processStream = (
  streamName = 'unnamedStreamer',
  streamReader,
  streamProcessor,
  receivedChunks = '',
) => ({ done, value } = {}) => {
  if (IS_DEV) { // Stream benchmarking
    value
    ? timer(streamName, 'Log')
    : done
      ? streamProcessor && timer(streamName, 'End')
      : timer(streamName);

    // troubleshooting
    // if (value) {
    //   const blah = new TextDecoder('utf-8').decode(value).split('\n');
    //   console.log('received new chunk', blah.length);
    //   console.log('new chunk, first', blah[0]);
    //   console.log('new chunk, last', blah[blah.length - 1]);
    // }
  }

  const newChunk = new TextDecoder('utf-8').decode(value);
  const processNext = processStream(
    streamName,
    streamReader,
    streamProcessor,
    receivedChunks.concat(newChunk),
  );

  return done
    ? receivedChunks
    : value && streamProcessor
      ? streamProcessor(
        newChunk,
        () => streamReader.read()
          .then(processNext),
      )
      : streamReader.read()
        .then(processNext);
};
