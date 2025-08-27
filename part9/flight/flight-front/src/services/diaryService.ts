import axios from "axios";

import { DiaryEntry, NewDiaryEntry } from "../types";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>
}

const baseUrl = 'http://localhost:3000/api/diaries';

const getAllEntries = async () => {
  try {
    const res = await axios.get<DiaryEntry[]>(baseUrl);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      console.log(error.status);
      console.error(error.response);
      // Do something with this error...
    } else {
      console.error(error);
    }
  }
};

const createDiaryEntry = async (obj: NewDiaryEntry): Promise<DiaryEntry | undefined> => {
  try {
    const res = await axios.post(baseUrl, obj);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      console.log(error.status);
      console.error(error.response);
    // Do something with this error...
    } else {
      console.error(error);
    }
  }
};

export default { getAllEntries, createDiaryEntry };