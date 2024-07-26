import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const Stat = ({ text, numClick }) => {
  return (text === "positive" ?  <p>{text} {numClick} %</p> :  <p>{text} {numClick}</p>);
}


const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>No feedback given</div>
    );
  }
  return (
    <>
      <Stat text="good" numClick={props.good} />
      <Stat text="neutral" numClick={props.neutral} />
      <Stat text="bad" numClick={props.bad} />
      <Stat text="all" numClick={props.all} />
      <Stat text="average" numClick={props.average} />
      <Stat text="positive" numClick={props.positive} />
    </>
  );
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const setGeneralStat = (change) => {
    setAll(all + 1);
    console.log(change)
    setAverage((good - bad + change) / (all + 1));
  }

  const handleGoodClick = () => {
    setGood(good + 1);
    setGeneralStat(1);
    setPositive((good + 1) / (all + 1) * 100);
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    setGeneralStat(0);
    setPositive((good) / (all + 1) * 100);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
    setGeneralStat(-1);
    setPositive((good) / (all + 1) * 100);
  }


  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  );
}

export default App