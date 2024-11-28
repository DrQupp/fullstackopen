import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatient, Patient, NewPatient } from '../types';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => {
    return ({
      id: patient.id,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      occupation: patient.occupation
    });
  });
};

const addPatient = (patient: NewPatient): Patient => {

  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitivePatients,
  addPatient
};