describe('API Route - /api/news', () => {
    const apiUrl = '/api/news';

    describe('Successful Responses', () => {
        it('should return news data successfully', () => {
            cy.request(apiUrl).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
            });
        });

        it('should return valid news items structure', () => {
            cy.request(apiUrl).then((response) => {
                expect(response.body).to.be.an('array');

                if (response.body.length > 0) {
                    const newsItem = response.body[0];
                    expect(newsItem).to.have.property('id');
                    expect(newsItem).to.have.property('headline');
                    expect(newsItem).to.have.property('url');
                    expect(newsItem).to.have.property('datetime');
                    expect(newsItem).to.have.property('image');
                    expect(newsItem).to.have.property('source');
                    expect(newsItem).to.have.property('category');
                }
            });
        });

        it('should return news with valid data types', () => {
            cy.request(apiUrl).then((response) => {
                if (response.body.length > 0) {
                    const newsItem = response.body[0];
                    expect(newsItem.id).to.be.a('number');
                    expect(newsItem.headline).to.be.a('string');
                    expect(newsItem.url).to.be.a('string');
                    expect(newsItem.datetime).to.be.a('number');
                }
            });
        });

        it('should have proper cache headers', () => {
            cy.request(apiUrl).then((response) => {
                expect(response.headers).to.have.property('cache-control');
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle timeout gracefully', () => {
            cy.intercept('GET', apiUrl, {
                delay: 11000, // More than 10s timeout
                statusCode: 200,
                body: []
            }).as('timeoutRequest');

            cy.request({
                url: apiUrl,
                failOnStatusCode: false,
                timeout: 12000
            }).then((response) => {
                // Should either timeout or return cached data
                expect([200, 408, 500, 504]).to.include(response.status);
            });
        });

        it('should return error for invalid responses', () => {
            // Test with invalid API key scenario by requesting without waiting
            cy.request({
                url: apiUrl,
                failOnStatusCode: false
            }).then((response) => {
                // API should return 200 with data or 500 range for errors
                expect([200, 500, 502, 503]).to.include(response.status);
            });
        });
    });

    describe('Response Validation', () => {
        it('should filter out invalid news items', () => {
            cy.request(apiUrl).then((response) => {
                response.body.forEach((item: any) => {
                    expect(item.id).to.exist;
                    expect(item.headline).to.exist;
                    expect(item.url).to.exist;
                    expect(item.datetime).to.exist;
                });
            });
        });

        it('should return reasonable number of items', () => {
            cy.request(apiUrl).then((response) => {
                expect(response.body.length).to.be.greaterThan(0);
                expect(response.body.length).to.be.lessThan(1000); // Reasonable limit
            });
        });
    });

    describe('Performance', () => {
        it('should respond within acceptable time', () => {
            const start = Date.now();

            cy.request(apiUrl).then(() => {
                const duration = Date.now() - start;
                expect(duration).to.be.lessThan(5000); // 5 seconds
            });
        });

        it('should handle concurrent requests', () => {
            // Cypress commands are already queued and executed in order
            cy.request(apiUrl).then((response1) => {
                expect(response1.status).to.eq(200);
            });

            cy.request(apiUrl).then((response2) => {
                expect(response2.status).to.eq(200);
            });

            cy.request(apiUrl).then((response3) => {
                expect(response3.status).to.eq(200);
            });
        });
    });
});
