const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.DISABLE_BACKGROUND_SERVICES = 'true';

const { app } = require('../server');

test('GET /api/health returns API status payload', async () => {
    const response = await request(app).get('/api/health');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
        status: 'ok',
        message: 'OrderIQ API is running',
    });
});

