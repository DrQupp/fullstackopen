import express from 'express';
import { Response } from 'express';
import diaryService from '../services/diagnosisService';
import { Diagnosis } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {

  res.send(diaryService.getDiagnoses());
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;