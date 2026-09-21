describe("Navigation", () => {
  it("shows the nav bar with all three tabs on load", () => {
    cy.visit("/");

    cy.get('[data-test-id="nav-home"]')
      .should("be.visible")
      .and("contain.text", "Home");
    cy.get('[data-test-id="nav-workout-calendar"]')
      .should("be.visible")
      .and("contain.text", "Kalender");
    cy.get('[data-test-id="nav-categories"]')
      .should("be.visible")
      .and("contain.text", "Kategorien");
  });

  it("navigates to the workouts page by default", () => {
    cy.visit("/");
    cy.url().should("include", "/home");
    cy.get('[data-test-id="search"]').should(
      "contain.text",
      "Workouts durchsuchen",
    );
  });

  it("navigates to the categories page", () => {
    cy.visit("/");
    cy.get('[data-test-id="nav-categories"]').click();

    cy.url().should("include", "/categories");
    cy.get('[data-test-id="search"]').should(
      "contain.text",
      "Kategorien durchsuchen",
    );
  });

  it("navigates to the workout calendar page", () => {
    cy.visit("/");
    cy.get('[data-test-id="nav-workout-calendar"]').click();

    cy.url().should("include", "/workout-calendar");
  });

  it("marks the active tab via aria-selected", () => {
    cy.visit("/categories");

    cy.get('[data-test-id="nav-categories"]').should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get('[data-test-id="nav-home"]').should(
      "have.attr",
      "aria-selected",
      "false",
    );
  });
});
export {};