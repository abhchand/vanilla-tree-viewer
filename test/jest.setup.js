import fetch from 'node-fetch';

if (!global.fetch) {
    global.fetch = fetch;
}
