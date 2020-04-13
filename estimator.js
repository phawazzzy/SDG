/* eslint-disable max-len */
/* eslint-disable consistent-return */
const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    // population,
    totalHospitalBeds,
    region
  } = data;

  function normalise(userTime) {
    let time = '';
    if (periodType === 'days') {
      time = userTime;
    }
    if (periodType === 'weeks') {
      time = userTime * 7;
    }
    if (periodType === 'months') {
      time = userTime * 30;
    }
    return time;
  }
  const impactcurrentlyInfected = reportedCases * 10;
  const SImpactcurrentlyInfected = reportedCases * 50;

  // number of positive people

  const IMinfectionsBYRequestedTime = impactcurrentlyInfected * 2 ** (Math.trunc(normalise(timeToElapse) / 3));
  const SinfectionsByRequestedTime = SImpactcurrentlyInfected * 2 ** (Math.trunc(normalise(timeToElapse) / 3));
  // challenge 2

  // number of severe positive cases
  const severeCasesByRequestedTime = Math.trunc(0.15 * IMinfectionsBYRequestedTime);
  const severeCasesByRequestedTimeSI = Math.trunc(0.15 * SinfectionsByRequestedTime);

  const IhospitalBedsByRequestedTime = Math.trunc((0.35 * totalHospitalBeds) - severeCasesByRequestedTime);

  const ShospitalBedsByRequestedTime = Math.trunc((0.35 * totalHospitalBeds) - severeCasesByRequestedTimeSI);

  // challenge 3
  const IcasesForICUByRequestedTime = Math.trunc(0.05 * IMinfectionsBYRequestedTime);
  const SIcasesForICUByRequestedTime = Math.trunc(0.05 * SinfectionsByRequestedTime);

  const IcasesForVentilatorsByRequestedTime = Math.trunc(IMinfectionsBYRequestedTime * 0.02);
  const SIcasesForVentilatorsByRequestedTime = Math.trunc(SinfectionsByRequestedTime * 0.02);

  const AVDP = region.avgDailyIncomePopulation;
  const AVDIU = region.avgDailyIncomeInUSD;
  const IMdollarsInFlight = (IMinfectionsBYRequestedTime * AVDP * AVDIU) / Math.trunc(normalise(timeToElapse));

  const SIdollarsInFlight = (SinfectionsByRequestedTime * region.avgDailyIncomePopulation * region.avgDailyIncomeInUSD) / Math.trunc(normalise(timeToElapse));

  const IMDIF = Math.trunc(IMdollarsInFlight);
  const SIDIF = Math.trunc(SIdollarsInFlight);

  return {
    data: { ...data },
    impact: {
      currentlyInfected: impactcurrentlyInfected,
      infectionsByRequestedTime: IMinfectionsBYRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: IhospitalBedsByRequestedTime,
      casesForICUByRequestedTime: IcasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: IcasesForVentilatorsByRequestedTime,
      dollarsInFlight: IMDIF
    },
    severeImpact: {
      currentlyInfected: SImpactcurrentlyInfected,
      infectionsByRequestedTime: SinfectionsByRequestedTime,
      severeCasesByRequestedTime: severeCasesByRequestedTimeSI,
      hospitalBedsByRequestedTime: ShospitalBedsByRequestedTime,
      casesForICUByRequestedTime: SIcasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: SIcasesForVentilatorsByRequestedTime,
      dollarsInFlight: SIDIF
    }
  };
};

module.exports = covid19ImpactEstimator;
