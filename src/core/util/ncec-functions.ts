import { sprintf } from 'sprintf-js';
export function getNcecCategoryLevels(categoryCode: any): number | any {
  const data: any[] = [];

  for (let level = 1; level <= 5; level++) {
    data[level] = `${categoryCode}-C-${level}`;
    return level;
  }
  return data;
}

export const generateNcecCertNo = (app, countAll) => {
  // const category = app.category;
  const base = 'NCEC';
  const appNo = sprintf('%04s', countAll + 1);
  const matrixCode = getNcecCategorizationMatrixCalc(app);
  return base + '/' + matrixCode + '/' + appNo;
};
export const getNcecCategoryLevelText = (categoryLevel) => {
  let texts: string;
  switch (categoryLevel) {
    case 1:
      texts = 'CONTRACTS UP TO AND ABOVE $200M';
      break;
    case 2:
      texts = 'CONTRACTS BELOW $200M';
      break;
    case 3:
      texts = 'CONTRACTS BELOW $100M';
      break;
    case 4:
      texts = 'CONTRACTS BELOW $50M';
      break;
    case 5:
      texts = 'CONTRACTS BELOW $10M';
      break;
  }
  return texts;
};

export const getNcecCategorizationMatrixCalc = (app) => {
  const categoryCode = app.category.code;
  let newMatrix = '';
  const type = app.categoryLevelNo
    ? getNcecSubCategoryByMatrix(app)
    : app.categoryLevelNo;
  // check if category is not manufacturing and related services
  if (categoryCode != 'MS') {
    newMatrix = app.ssingleContractExecutedId && type != 5 ? 'N' : '';
  }
  if (app.isNewFacility != '') newMatrix = app.isNewFacility ? 'N' : '';
  return newMatrix + categoryCode + '-C-' + type;
};

export function getNcecSubCategoryByMatrix(app): number {
  const categoryCode = app.category.code;
  const employeesNo = parseInt(app.percentageEmployeesNo, 10);
  const capitalizationValue = app.capitalization.name;

  if (
    categoryCode === 'FC' ||
    categoryCode === 'SS' ||
    categoryCode === 'EC' ||
    categoryCode === 'DA'
  ) {
    if (
      capitalizationValue === 1 &&
      employeesNo >= 200 &&
      getNcecContractCondition(1)
    )
      return 1;
    if (
      capitalizationValue === 1 ||
      (capitalizationValue === 2 &&
        employeesNo >= 200 &&
        getNcecContractCondition([1, 2]))
    )
      return 2;
    if (
      (capitalizationValue === 1 ||
        capitalizationValue === 2 ||
        capitalizationValue === 3) &&
      employeesNo >= 100 &&
      getNcecContractCondition([1, 2, 3])
    )
      return 3;
    if (
      (capitalizationValue === 1 ||
        capitalizationValue === 2 ||
        capitalizationValue === 3 ||
        capitalizationValue === 4 ||
        capitalizationValue === 5 ||
        capitalizationValue === 6) &&
      employeesNo >= 50 &&
      getNcecContractCondition([1, 2, 3, 4])
    )
      return 4;
    if (
      (capitalizationValue === 7 || capitalizationValue === 8) &&
      employeesNo < 50
    )
      return 5;
  }

  if (categoryCode === 'PS') {
    // const categoryCode = app.category.code;
    const employeesNo = parseInt(app.percentageEmployeesNo, 10);
    const capitalizationValue = app.capitalization.name;

    if (
      capitalizationValue === 1 &&
      employeesNo >= 100 &&
      getNcecContractCondition(app, 1)
    )
      return 1;
    if (
      [1, 2].includes(capitalizationValue) &&
      employeesNo >= 50 &&
      getNcecContractCondition(app, [1, 2])
    )
      return 2;
    if (
      [1, 2, 3].includes(capitalizationValue) &&
      employeesNo >= 20 &&
      getNcecContractCondition(app, [1, 2, 3])
    )
      return 3;
    if (
      [1, 2, 3, 4, 5, 6].includes(capitalizationValue) &&
      employeesNo < 20 &&
      getNcecContractCondition(app, [1, 2, 3, 4])
    )
      return 4;
    if ([7, 8].includes(capitalizationValue) && employeesNo < 20) return 5;

    return 5;
  }

  if (categoryCode === 'MS') {
    const employeesNo = parseInt(app.percentageEmployeesNo, 10);
    const capitalizationValue = app.capitalization.name;

    if ([1, 2].includes(capitalizationValue) && employeesNo >= 200) return 1;
    if ([1, 2, 3].includes(capitalizationValue) && employeesNo >= 100) return 2;
    if ([1, 2, 3, 4, 5].includes(capitalizationValue) && employeesNo >= 50)
      return 3;
    if ([1, 2, 3, 4, 5, 6, 7].includes(capitalizationValue)) return 4;
    if (capitalizationValue === 8 && employeesNo < 50) return 5;

    return 5;
  }

  if (categoryCode === 'CS' || categoryCode === 'QS') {
    const categoryCode = app.category.code;
    const employeesNo = parseInt(app.percentageEmployeesNo, 10);
    const capitalizationValue = app.capitalization.name;

    if (
      [1, 2, 3].includes(capitalizationValue) &&
      employeesNo >= 50 &&
      getNcecContractCondition(app, 1)
    )
      return 1;
    if (
      [1, 2, 3, 4].includes(capitalizationValue) &&
      employeesNo >= 25 &&
      getNcecContractCondition(app, [1, 2])
    )
      return 2;
    if (
      [1, 2, 3, 4, 5, 6].includes(capitalizationValue) &&
      employeesNo >= 20 &&
      getNcecContractCondition(app, [1, 2, 3])
    )
      return 3;

    if (categoryCode === 'QS') {
      if (
        [1, 2, 3, 4, 5, 6, 7].includes(capitalizationValue) &&
        employeesNo < 20 &&
        getNcecContractCondition(app, [1, 2, 3, 4])
      )
        return 4;
      if (
        [1, 2, 3, 4, 5, 6, 7].includes(capitalizationValue) &&
        employeesNo < 20 &&
        getNcecContractCondition(app, 5)
      )
        return 5;
    } else {
      if (
        [1, 2, 3, 4, 5, 6].includes(capitalizationValue) &&
        getNcecContractCondition(app, [1, 2, 3, 4])
      )
        return 4;
      if ([7, 8].includes(capitalizationValue) && employeesNo < 20) return 5;
    }

    return 5;
  }

  return 5;
}

export function getNcecContractCondition(
  app,
  value: number | number[] = [],
): boolean {
  const singleContractExecuted = app.singleContractExecuted.name;

  if (singleContractExecuted !== undefined && singleContractExecuted !== null) {
    if (Array.isArray(value)) {
      return value.includes(singleContractExecuted);
    }
    return singleContractExecuted === value;
  } else {
    return true;
  }
}
