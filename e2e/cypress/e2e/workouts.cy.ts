const uniqueName = (prefix: string) => `${prefix} ${Date.now()}`;

const openCreateDialog = () => {
  cy.get('[data-test-id="create-button"]').click();
  cy.get('[data-test-id="workout-form"]').should("be.visible");
};

const fillAndSubmit = (name: string, durationMin: number) => {
  cy.get('[data-test-id="workout-duration-input"]').clear().type(String(durationMin));
  cy.get('[data-test-id="workout-name-input"]').clear().type(name);
  cy.get('[data-test-id="workout-submit"]').click();
  cy.get('[data-test-id="workout-form"]').should("not.exist");
};

const searchFor = (term: string) => {
  cy.get('[data-test-id="search-input"]').clear();
  if (term) {
    cy.get('[data-test-id="search-input"]').type(term);
  }
};

const deleteByName = (name: string) => {
  searchFor(name);
  cy.contains("tr[data-test-id^='row-']", name).within(() => {
    cy.get('button[data-test-id^="delete-"]').click();
  });
};

describe("Workouts – CRUD", () => {
  beforeEach(() => {
    cy.visit("/home");
  });

  it("creates a new workout and shows it in the table", () => {
    const name = uniqueName("Joggen");

    openCreateDialog();
    fillAndSubmit(name, 30);

    searchFor(name);
    cy.contains("td", name).should("be.visible");
    cy.contains("td", "30 min").should("be.visible");

    deleteByName(name);
  });

  it("edits an existing workout", () => {
    const originalName = uniqueName("Velo");
    const updatedName = uniqueName("Velo bearbeitet");

    openCreateDialog();
    fillAndSubmit(originalName, 45);

    searchFor(originalName);
    cy.contains("tr[data-test-id^='row-']", originalName).within(() => {
      cy.get('button[data-test-id^="edit-"]').click();
    });

    cy.get('[data-test-id="workout-name-input"]').clear().type(updatedName);
    cy.get('[data-test-id="workout-duration-input"]').clear().type("60");
    cy.get('[data-test-id="workout-submit"]').click();
    cy.get('[data-test-id="workout-form"]').should("not.exist");

    searchFor(updatedName);
    cy.contains("td", updatedName).should("be.visible");
    cy.contains("td", "60 min").should("be.visible");

    deleteByName(updatedName);
  });

  it("deletes a workout", () => {
    const name = uniqueName("Schwimmen");

    openCreateDialog();
    fillAndSubmit(name, 20);

    deleteByName(name);

    searchFor(name);
    cy.get('[data-test-id="empty-state"]').should("be.visible");
  });

  it("assigns a category to a workout", () => {
    const categoryName = uniqueName("Cardio");
    const workoutName = uniqueName("Laufen");

    cy.visit("/categories");
    cy.get('[data-test-id="create-button"]').click();
    cy.get('[data-test-id="category-name-input"]').type(categoryName);
    cy.get('[data-test-id="category-submit"]').click();
    cy.get('[data-test-id="category-form"]').should("not.exist");

    cy.visit("/home");
    openCreateDialog();
    cy.get('[data-test-id="workout-duration-input"]').clear().type("25");
    cy.get('[data-test-id="workout-name-input"]').clear().type(workoutName);
    cy.get('[data-test-id="workout-category-select"]').click();
    cy.get("mat-option").contains(categoryName).click();
    cy.get('[data-test-id="workout-submit"]').click();
    cy.get('[data-test-id="workout-form"]').should("not.exist");

    searchFor(workoutName);
    cy.contains("tr[data-test-id^='row-']", workoutName).within(() => {
      cy.contains("td", categoryName).should("be.visible");
    });

    deleteByName(workoutName);
    cy.visit("/categories");
    deleteByName(categoryName);
  });

  it("filters the table via search and shows the empty state for no matches", () => {
    searchFor("es-gibt-diesen-eintrag-ganz-sicher-nicht");
    cy.get('[data-test-id="empty-state"]').should("be.visible");

    searchFor("");
  });

  it("does not submit the form when required fields are missing", () => {
    openCreateDialog();
    cy.get('[data-test-id="workout-submit"]').should("be.disabled");

    cy.get('[data-test-id="workout-cancel"]').click();
    cy.get('[data-test-id="workout-form"]').should("not.exist");
  });
});

export {};