import { expect, server, BASE_URL } from './setup';

describe('Restaurants', () => {
  it.skip('get restaurants page', done => {
    server
      .get(`${BASE_URL}/restaurants`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.results).to.be.instanceOf(Array);
        res.body.messages.forEach(m => {
          expect(m).to.have.property('name');
          expect(m).to.have.property('message');
        });
        done();
      });
  });
});
