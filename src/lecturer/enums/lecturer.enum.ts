export enum DepartmentType {
  // Academic High-Level Containers
  FACULTY = 'FACULTY', // Used by Universities (e.g., Faculty of Science)
  SCHOOL = 'SCHOOL', // Used by Polytechnics/COEs (e.g., School of Engineering)

  // Teaching & Research Units
  ACADEMIC = 'ACADEMIC', // The actual department (e.g., Dept of Computer Science)
  RESEARCH_CENTRE = 'RESEARCH', // Specialized units or institutes (e.g., Centre for Energy Research)

  // Administrative & Support Units
  ADMINISTRATIVE = 'ADMIN', // Registry, Bursary, Student Affairs, ICT
  LIBRARY = 'LIBRARY', // Main and departmental libraries
  DIRECTORATE = 'DIRECTORATE', // Specialized offices (e.g., Directorate of Academic Planning)

  // Other specialized units
  MEDICAL = 'MEDICAL', // University Health Services or Teaching Hospitals
  SECURITY = 'SECURITY', // Campus security department
}
