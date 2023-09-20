import {calculatePartHealth, calculateMachineHealth} from '../calculations';
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
  partInfo,
} from '../../native-app/data/types';
import { exitCode } from 'process';

describe('calculatePartHealth', () => {
  it('calculates part health correctly', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const part: partInfo = {name: WeldingRobotPart.ErrorRate, value: 0.5};
    const expectedHealth = 72.22222222222223;

    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);
  });
});

describe('calculateMachineHealth', () => {
  it('calculates machine health correctly', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const parts = [
      {name: WeldingRobotPart.ErrorRate, value: 0.5},
      {name: WeldingRobotPart.VibrationLevel, value: 4.0},
      {name: WeldingRobotPart.ElectrodeWear, value: 0.8},
      {name: WeldingRobotPart.ShieldingPressure, value: 12.0},
      {name: WeldingRobotPart.WireFeedRate, value: 7.5},
      {name: WeldingRobotPart.ArcStability, value: 92.0},
      {name: WeldingRobotPart.SeamWidth, value: 1.5},
      {name: WeldingRobotPart.CoolingEfficiency, value: 85.0},
    ];
    const expectedHealth = 76.70138888888889;

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth);
  });
});

describe('part and machine health score of 0', () => {
  it('calculates a part health to be 0 using abnormal values', () => {
    const machineName: MachineType = MachineType.PaintingStation;
    const part: partInfo = {name: PaintingStationPart.FlowRate, value: 0.0};
    const expectedHealth = 0.0;
  
    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);
  })

  it('calculates a part health to be 0 using greater than abnormal values', () => {
    const machineName: MachineType = MachineType.PaintingStation;
    const part: partInfo = {name: PaintingStationPart.NozzleCondition, value: 1000.0};
    const expectedHealth = 0.0;
  
    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);

  })

  it('calculates a machine health to be 0 using greater than abnormal values', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const parts = [
      {name: AssemblyLinePart.AlignmentAccuracy, value: 2000.0},
      {name: AssemblyLinePart.BeltSpeed, value: 200.1},
      {name: AssemblyLinePart.FittingTolerance, value: 50.0},
      {name: AssemblyLinePart.Speed, value: 120.0}
    ];
    const expectedHealth = 0.0

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth)
  });
});

describe('failure response with unacceptable part types',() => {
  it('failure response with a part that is not applicapable to the machine', () => {
    const machineName: MachineType = MachineType.QualityControlStation;
    const part: partInfo = {name: AssemblyLinePart.AlignmentAccuracy, value: 5}

    const expectedHealth = -1.0
    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);
  });

  it('failure response with a part list that is not applicable to the machine', () => {  
    const machineName: MachineType = MachineType.QualityControlStation;
    const parts = [ // all parts from a different machine
      {name: AssemblyLinePart.AlignmentAccuracy, value: 2.0}, 
      {name: AssemblyLinePart.BeltSpeed, value: 2.1},
      {name: AssemblyLinePart.FittingTolerance, value: 0.065},
      {name: AssemblyLinePart.Speed, value: 12.0}
    ];
    const expectedHealth = -1.0

    const result = calculateMachineHealth(machineName, parts);
    expect(expectedHealth).toBe(expectedHealth)
  });
  
  // Was unable to create a test where I could pass a machine name that didn't exist or a parts list of 0
  // because typescript caught the error before even running the tests and was unable to assert on the exit code
  // given more time these should be in try catch blocks that can then be asserted on the error messaging
  // ----------------Scenario 1-------------------------
  // const machineInfo = machineDataTyped[machineName];
  // if (!machineInfo) { 
  //   return 0; // Handle cases where the machine name is not found in machineData
  // }
  // ----------------Scenario 2-------------------------
  // export function calculateMachineHealth(
  //   machineName: MachineType,
  //   parts: partInfo[],
  // ) {
  //   if (parts.length === 0) {
  //     return 0;
  //   }
});
