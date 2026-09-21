const uniqueName = (prefix: string) => `${prefix} ${Date.now()}`;

const openCreateDialog = () => {
  cy.get('[data-test-id="create-button"]').click();
  cy.get('[data-test-id="category-form"]').should("be.visible");
};

const fillAndSubmit = (name: string) => {
  cy.get('[data-test-id="category-name-input"]').clear().type(name);
  cy.get('[data-test-id="category-submit"]').click();
  cy.get('[data-test-id="category-form"]').should("not.exist");
};

const searchFor = (term: string) => {
  cy.get('[data-test-id="search-input"]').clear();
  if (term) {
    cy.get('[data-test-id="search-input"]').type(term);
  }
};

describe("Categories – CRUD", () => {
  beforeEach(() => {
    cy.visit("/categories");
  });

  it("creates a new category and shows it in the table", () => {
    const name = uniqueName("Ausdauer");

    openCreateDialog();
    fillAndSubmit(name);

    searchFor(name);
    cy.contains("td", name).should("be.visible");

    cy.contains("tr[data-test-id^='row-']", name).within(() => {
      cy.get('button[data-test-id^="delete-"]').click();
    });
  });

  it("edits an existing category", () => {
    const originalName = uniqueName("Kraft");
    const updatedName = uniqueName("Kraft bearbeitet");

    openCreateDialog();
    fillAndSubmit(originalName);

    searchFor(originalName);
    cy.contains("tr[data-test-id^='row-']", originalName).within(() => {
      cy.get('button[data-test-id^="edit-"]').click();
    });

    cy.get('[data-test-id="category-name-input"]').clear().type(updatedName);
    cy.get('[data-test-id="category-submit"]').click();
    cy.get('[data-test-id="category-form"]').should("not.exist");

    searchFor(updatedName);
    cy.contains("td", updatedName).should("be.visible");
    cy.contains("td", originalName).should("not.exist");

    cy.contains("tr[data-test-id^='row-']", updatedName).within(() => {
      cy.get('button[data-test-id^="delete-"]').click();
    });
  });

  it("deletes a category", () => {
    const name = uniqueName("Mobility");

    openCreateDialog();
    fillAndSubmit(name);

    searchFor(name);
    cy.contains("tr[data-test-id^='row-']", name).within(() => {
      cy.get('button[data-test-id^="delete-"]').click();
    });

    searchFor(name);
    cy.get('[data-test-id="empty-state"]').should("be.visible");
  });

  it("does not submit the form when the name is empty", () => {
    openCreateDialog();
    cy.get('[data-test-id="category-submit"]').should("be.disabled");

    cy.get('[data-test-id="category-cancel"]').click();
    cy.get('[data-test-id="category-form"]').should("not.exist");
  });
});

export {};
