import { useEffect, useState } from 'react';
import DiaryEntries from './components/DiaryEntries';
import { DiaryEntry, NewDiaryEntry } from './types';
import DiaryForm from './components/DiaryForm';
import DiaryService from './services/diaryService';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const getAll = async () => {
      const res = await DiaryService.getAllEntries();
      if (res) {
        setDiaryEntries(res);
      }
    };
    getAll();
    
  },[]);

  const entryCreation = async (obj: NewDiaryEntry) => {
    
    const diaryEntry = await DiaryService.createDiaryEntry(obj);
    if (diaryEntry) {
      setDiaryEntries(diaryEntries.concat(diaryEntry));
    }
  };

  if (diaryEntries.length === 0) {
    return (
      <div>
        loading...
      </div>
    );
  }

  return (
    <div>
      <DiaryForm createEntry={entryCreation} />
      <DiaryEntries entries={diaryEntries}/>
    </div>
  );
};

export default App;
