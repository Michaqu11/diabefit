import { AllCorrection, mockAllCorrections, CorrectionData } from "./storagesTypes"; 

const createCorrectionDay = (dayID: number): AllCorrection => {
  const newCorrection: AllCorrection = {};
  newCorrection[dayID] = [...mockAllCorrections];
  return newCorrection;
};

const isCorrectionDayExist = (dayID: number, allCorrections: AllCorrection) => {
  return dayID in allCorrections;
};

const putCorrectionIntoDay = (
  dayID: number,
  correction: CorrectionData,
  allCorrections: AllCorrection,
) => {
  const dayCorrections = allCorrections[dayID] || [];
  dayCorrections.push(correction);
  allCorrections[dayID] = dayCorrections;
  return allCorrections;
};

const addCorrection = (dayID: number, correction: CorrectionData) => {
  const correctionsFromStore = localStorage.getItem("corrections");
  let allCorrections: AllCorrection = {};

  if (correctionsFromStore) {
    allCorrections = JSON.parse(correctionsFromStore) as AllCorrection;
    if (!isCorrectionDayExist(dayID, allCorrections)) {
      const newDay = createCorrectionDay(dayID);
      allCorrections = { ...allCorrections, ...newDay };
    }
  } else {
    allCorrections = createCorrectionDay(dayID);
  }

  const result = putCorrectionIntoDay(dayID, correction, allCorrections);
  localStorage.setItem("corrections", JSON.stringify(result));
};

export const saveCorrection = (correction: CorrectionData, dayID: number) => {
  addCorrection(dayID, correction);
};

export const removeCorrection = (dayID: number, id: string) => {
  const correctionsFromStore = localStorage.getItem("corrections");
  if (correctionsFromStore) {
    const allCorrections = JSON.parse(correctionsFromStore) as AllCorrection;
    if (isCorrectionDayExist(dayID, allCorrections)) {
      const updatedCorrections = allCorrections[dayID].filter((c) => c.id !== id);
      allCorrections[dayID] = updatedCorrections;
      localStorage.setItem("corrections", JSON.stringify(allCorrections));
    }
  }
};

export const readDayCorrection = (dayID: number) => {
  const correctionsFromStore = localStorage.getItem("corrections");
  if (correctionsFromStore) {
    const allCorrections = JSON.parse(correctionsFromStore) as AllCorrection;
    return allCorrections[dayID] || [];
  }
  return [];
};
