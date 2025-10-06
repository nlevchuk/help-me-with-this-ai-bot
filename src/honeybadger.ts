import Honeybadger from '@honeybadger-io/js'

Honeybadger.configure({
  apiKey: process.env.HONEYBADGER_API_KEY,
  environment: process.env.NODE_ENV,
});

Honeybadger.setContext({ pet_id: 'hmwt' });

export default Honeybadger;
