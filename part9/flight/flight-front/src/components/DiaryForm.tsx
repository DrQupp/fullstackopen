import { useState } from "react";
import { NewDiaryEntry, Visibility, Weather } from "../types";

interface DiaryFormProp {
  createEntry: (obj: NewDiaryEntry) => Promise<void>
}


interface WeatherSelectorProp {
  setWeather: React.Dispatch<React.SetStateAction<Weather>>
}

const WeatherSelector = ({setWeather}: WeatherSelectorProp) => {
  return (
    <div>
      Weather: 
      Sunny
      <input checked type="radio" name="weather" onChange={() => setWeather(Weather.Sunny)} />
      Rainy
      <input type="radio" name="weather" onChange={() => setWeather(Weather.Rainy)} />
      Cloudy
      <input type="radio" name="weather" onChange={() => setWeather(Weather.Cloudy)} />
      Stormy
      <input type="radio" name="weather" onChange={() => setWeather(Weather.Stormy)} />
      Windy
      <input type="radio" name="weather" onChange={() => setWeather(Weather.Windy)} />
    </div>
  );
};


interface VisibilitySelectorProp {
  setVisibility: React.Dispatch<React.SetStateAction<Visibility>>
}

const VisibilitySelector = ({setVisibility}: VisibilitySelectorProp) => {
  return (
    <div>
      Visibility:
      Great
      <input checked type="radio" name="visibility" onChange={() => setVisibility(Visibility.Great)} />
      Good
      <input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Good)} />
      Ok
      <input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Ok)} />
      Poor
      <input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Poor)} />
    </div>
  );
};



const DiaryForm = ({createEntry}: DiaryFormProp) => {
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState<string>('');



  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const obj: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment
    };
    createEntry(obj);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <h3>Add new entry</h3>
        Date: <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <WeatherSelector setWeather={setWeather} />
        <VisibilitySelector setVisibility={setVisibility} />
        Comment <input value={comment} onChange={(event) => setComment(event.target.value)} />
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </div>
  );

};

export default DiaryForm;