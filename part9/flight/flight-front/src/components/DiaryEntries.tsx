import { DiaryEntry } from "../types";

interface DiaryEntriesProp {
  entries: DiaryEntry[]
}

const DiaryEntries = ({entries}: DiaryEntriesProp) => {
  return (
    
    <div>
      <h3>Diary entries</h3>
      {entries.map(e => (
        <div key={e.id}>
          <h3>{e.date}</h3>
          <div>visibility: {e.visibility}</div>
          <div>weather: {e.weather}</div>
        </div>
      ))}
    </div>
  );
};

export default DiaryEntries;