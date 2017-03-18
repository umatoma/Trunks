import { Record, List } from 'immutable';

export const ModelWorker = Record({
  status: 'ready',
  duration: 0,
  rate: 0,
  filename: '',
});

export const ModelMetrics = Record({
  bytes_in: { total: 0, mean: 0 },
  bytes_out: { total: 0, mean: 0 },
  duration: 0,
  earliest: '',
  end: '',
  errors: null,
  latencies: { mean: 0, max: 0, '50th': 0, '95th': 0, '99th': 0 },
  latest: {},
  rate: 0,
  requests: 0,
  status_codes: {},
  success: 0,
  wait: 0,
});

export const ModelReport = Record({
  isFetching: true,
  error: null,
  metrics: new ModelMetrics(),
  results: List(),
});

export const ModelFormAttack = Record({
  Body: '',
  Duration: '10s',
  Rate: 1,
  Targets: '',
});
