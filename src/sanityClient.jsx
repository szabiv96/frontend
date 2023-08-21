import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.REACT_APP_PROJECT_ID_PORTFOLIO,
    dataset: process.env.REACT_APP_DATASET_PORTFOLIO,
    apiVersion: '2021-10-21',
    useCdn: true,
    token: process.env.REACT_APP_TOKEN,
    ignoreBrowserTokenWarning: true,
});


export default client;
