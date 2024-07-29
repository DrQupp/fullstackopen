const Filter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      Find countries <input
        value={filterValue}
        onChange={handleFilterChange}
      />
    </div>
  );
}

export default Filter