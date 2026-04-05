export const nigerianStaffTemplateSchema = {
  'EMPLOYMENT NUMBER': {
    prop: 'employeeNumber',
    type: String,
    required: false,
  },
  'LAST NAME*': {
    prop: 'lastName',
    type: String,
    required: true,
  },
  'FIRST NAME*': {
    prop: 'firstName',
    type: String,
    required: true,
  },
  'OTHER NAMES': {
    prop: 'otherNames',
    type: String,
    required: false,
  },
  'LOCAL GOVERNMENT AREA*': {
    prop: 'lga',
    type: String,
    required: true,
  },
  'NIN NUMBER*': {
    prop: 'ninNumber',
    type: String,
    required: true,
  },
  'STATE*': {
    prop: 'state',
    type: String,
    required: true,
  },
  'GENDER*': {
    prop: 'gender',
    type: String,
    required: false,
  },
  'DATE OF BIRTH (DD/MM/YYYY)*': {
    prop: 'dob',
    type: Date,
    required: true,
  },
  'EMAIL*': {
    prop: 'email',
    type: String,
    required: true,
  },
  'HIGHEST EDUCATION LEVEL*': {
    prop: 'educationLevel',
    type: String,
    required: true,
  },
  'PHONE NUMBER*': {
    prop: 'phoneNumber',
    type: String,
    required: true,
  },
  'JOB TITLE*': {
    prop: 'jobType',
    type: String,
    required: true,
  },
  'IS MANAGEMENT (YES/NO)*': {
    prop: 'isManagement',
    type: String,
    required: true,
  },
  'DATE OF EMPLOYMENT (DD/MM/YYYY)*': {
    prop: 'employmentDate',
    type: Date,
    required: true,
  },
  'NATURE OF EMPLOYMENT*': {
    prop: 'employmentNature',
    type: String,
    required: true,
  },
  'LOCATION*': {
    prop: 'location',
    type: String,
    required: false,
  },
  'YEARS OF WORK EXPERIENCE (1-100)*': {
    prop: 'workExperienceYears',
    type: Number,
    required: true,
  },
  'YEARS IN THE COMPANY (1-100)*': {
    prop: 'yearsInCompany',
    type: Number,
    required: true,
  },
  'YEARS IN CURRENT POSITION (1-100)*': {
    prop: 'yearsInCurrentPosition',
    type: Number,
    required: true,
  },
};
