const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  );
}

const Content = ({ parts }) => {
  return (
    parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)
  );
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  );
}

const Total = ({ parts }) => {
  const sum = parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );
  return (
    <h4>Number of exercises: {sum}</h4>
  );
}

export default Course;