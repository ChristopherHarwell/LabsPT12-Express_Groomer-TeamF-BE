const request = require('supertest');
const express = require('express');
const Locations = require('../../api/location/locationModel');
const locationRouter = require('../../api/location/locationRouter');
const server = express();
server.use(express.json());

// Test object factory functions
const generate = require('../../test/utils/generate');

// Mocks
// The model functions for the location r
jest.mock('../../api/location/locationModel');

// Auth middleware
jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

// Testing
describe('locations router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use(['/locations'], locationRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test the GET endpoints
  describe('the GET locations/ route', () => {
    it('should return all locations', async () => {
      Locations.findAll.mockResolvedValue([]);
      const res = await request(server).get('/locations');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);

      // Verify that the mock was called
      expect(Locations.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('the GET locations/:groomerId route', () => {
    it('should return a 200 code when it finds the id', async () => {
      const location = generate.buildLocation();
      Locations.findBy.mockResolvedValue([location]);
      const res = await request(server).get(`/locations/${location.groomerId}`);
      const first = res.body.data[0];

      expect(res.status).toBe(200);
      expect(first).toEqual(location);

      // Verify that the mock was called
      expect(Locations.findBy).toHaveBeenCalledWith({
        groomerId: location.groomerId,
      });
      expect(Locations.findBy.mock.calls.length).toBe(1);
    });

    it("should return a 404 code when it can't find the id", async () => {
      Locations.findBy.mockResolvedValue([]);
      const groomerId = generate.getOktaId();
      const res = await request(server).get(`/locations/${groomerId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Location Not Found');

      // Verify that the mock was called appropriately
      expect(Locations.findBy).toHaveBeenCalledWith({ groomerId });
      expect(Locations.findBy.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /locations', () => {
    it('should return 200 when profile is created', async () => {
      const location = generate.buildLocation();
      const newGroomerId = generate.getOktaId();
      Locations.findByGroomerId.mockResolvedValue(location);
      Locations.update.mockResolvedValue([
        {
          ...location,
          groomerId: newGroomerId,
        },
      ]);
      const res = await request(server)
        .put(`/locations/${location.groomerId}`)
        .send(location);
      const first = res.body.data[0];

      expect(res.status).toBe(200);
      expect(first.groomerId).not.toBe(location.groomerId);
      expect(first.groomerId).toBe(newGroomerId);

      // Verify that the mocks were called
      expect(Locations.findByGroomerId.mock.calls.length).toBe(1);
      expect(Locations.findByGroomerId).toHaveBeenCalledWith(
        location.groomerId
      );
      expect(Locations.update.mock.calls.length).toBe(1);
      expect(Locations.update).toHaveBeenCalledWith(
        location.groomerId,
        location
      );
    });
  });
});
