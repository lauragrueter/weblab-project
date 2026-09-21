const testIdSelector = (testId: string) => cy.get(`[data-test-id="${testId}"]`);

describe("fitlog", () => {
  it("User Journey", () => {
    cy.visit("/");
    testIdSelector("search").should("contain.text", "Workouts durchsuchen");
  });
});
