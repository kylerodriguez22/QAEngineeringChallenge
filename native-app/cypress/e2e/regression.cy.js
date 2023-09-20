import {
    AssemblyLinePart,
    MachineType,
    PaintingStationPart,
    QualityControlStationPart,
    WeldingRobotPart,
    machineNames,
    partInfo,
  } from '../../data/types';

const elements = {
    addPartsLink: 'log-a-part-link',
    calcHealthBtn: 'calc-health-btn',
    resetDataBtn: 'reset-data-btn',
    machineStateTab: 'machine-state-tab',
    logPartTab: 'log-part-tab',
    factoryHealth: 'factory-health',
    factoryHealthScore: 'factory-health-score',

};

const scores = {
    weldingRobot: 'weldingRobot-score',
    assemblyLine: 'assemblyLine-score',
    qualityControlStation: 'qualityControlStation-score',
    paintingStation: 'paintingStation-score'
}

const inputs = {
    machinePicker: ':nth-child(2) > [data-testid="web_picker"]',
    partPicker: ':nth-child(4) > [data-testid="web_picker"]',
    partValueBox: 'part-value-input-box',
    saveBtn: 'save-btn'
}

Cypress.Commands.add('getId', (id) => {
    cy.get('[data-testid="' + id + '"]');
});

Cypress.Commands.add('addMachinePart', (machine, part, value) => {
    cy.getId(elements.logPartTab).click();
    cy.get('h1').should('exist').contains('Log Part');
    cy.get(inputs.machinePicker).should('exist').select(machine);
    cy.get(inputs.partPicker).should('exist').select(part);
    cy.getId(inputs.partValueBox).should('exist').clear().type(value);
    cy.getId(inputs.saveBtn).should('exist').click();
    cy.getId(elements.machineStateTab).click();
})

context('Regression tests for layout page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    afterEach(() => {
        cy.getId(elements.resetDataBtn).click();
    })

    it('Verifies elements on initial page load when there are no parts', () => {
        cy.get('h1').should('exist').contains('Machine State');
        cy.getId(elements.addPartsLink).should('exist', 'be.clickable').contains('Please log a part to check machine health');
        cy.getId(elements.calcHealthBtn).should('exist').contains('Calculate Health');
        cy.getId(elements.resetDataBtn).should('exist').contains('Reset Machine Data');
        cy.getId(elements.machineStateTab).should('exist').contains('Machine State');
        cy.getId(elements.logPartTab).should('exist').contains('Log Part');
    });

    it('Verifies added parts are displayed on the layout page', () => {
        cy.addMachinePart(machineNames.paintingStation, PaintingStationPart.Pressure, 45);
        cy.getId(machineNames.paintingStation).should('exist').contains(machineNames.paintingStation);
        cy.getId(PaintingStationPart.Pressure).should('exist').contains(45);
        cy.addMachinePart(machineNames.assemblyLine, AssemblyLinePart.BeltSpeed, 0.8);
        cy.getId(machineNames.assemblyLine).should('exist').contains(machineNames.assemblyLine);
        cy.getId(AssemblyLinePart.BeltSpeed).should('exist').contains(0.8);
    });

    it('Verifies the correct factory and machine health scores', () => {
        cy.addMachinePart(machineNames.qualityControlStation, QualityControlStationPart.LightIntensity, 90);
        cy.addMachinePart(machineNames.weldingRobot, WeldingRobotPart.WireFeedRate, 11);
        cy.addMachinePart(machineNames.assemblyLine, AssemblyLinePart.FittingTolerance, 0.01);
        cy.getId(elements.calcHealthBtn).click();

        cy.getId(elements.factoryHealth).should('exist').contains('Factory Health Score');
        cy.getId(elements.factoryHealthScore).should('exist').contains(36.39);
        cy.getId(scores.qualityControlStation).should('exist').contains(50.00);
        cy.getId(scores.weldingRobot).should('exist').contains(9.18);
        cy.getId(scores.assemblyLine).should('exist').contains(50.00)
    })

});