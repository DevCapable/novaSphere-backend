export const expatriateStaffTemplateSchema = {
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
  'PHONE NUMBER*': {
    prop: 'phoneNumber',
    type: String,
    required: true,
  },
  'HIGHEST EDUCATION LEVEL*': {
    prop: 'educationLevel',
    type: String,
    required: true,
  },
  'NATIONALITY*': {
    prop: 'nationality',
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
  'DATE OF FIRST QUOTA (DD/MM/YYYY)*': {
    prop: 'dateFirstQuota',
    type: Date,
    required: true,
  },
  'DATE OF CURRENT QUOTA (DD/MM/YYYY)*': {
    prop: 'dateCurrentQuota',
    type: Date,
    required: true,
  },
  'EXPIRY DATE OF CURRENT QUOTA (DD/MM/YYYY)*': {
    prop: 'expiryDateOfCurrentQuota',
    type: Date,
    required: true,
  },
  'CUMULATIVE YEARS SPENT IN NIGERIA (1-100)*': {
    prop: 'cumulativeYearsInCountry',
    type: Number,
    required: true,
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
  'PROJECT*': {
    prop: 'project',
    type: String,
    required: false,
  },
  'YEARS IN CURRENT POSITION (1-100)*': {
    prop: 'yearsInCurrentPosition',
    type: Number,
    required: true,
  },
};
