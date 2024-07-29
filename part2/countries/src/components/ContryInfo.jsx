const CountryDetails = ({ countryInfo }) => {
  console.log(`${Object.values(countryInfo.languages)}`);
  return (
    <div>
      <p>capital {countryInfo.capital}</p>
      <p>area {countryInfo.area}</p>
      <h4>languages</h4>
      <ul>
        {Object.values(countryInfo.languages).map(l => {
          return (<li key={l}>{l}</li>)
        })}
      </ul>
      <img src={countryInfo.flags.png} alt={countryInfo.flags.alt}></img>

    </div>
  )
};

const CountryInfo = ({ filter, countries }) => {
  const lowerFilter = filter.toLowerCase();
  const filteredCountries = countries.filter(c => {
    return (c.name.common.toLowerCase().includes(lowerFilter) || c.name.official.toLowerCase().includes(lowerFilter));
  });
  if (filteredCountries.length === 1) {
    return (
      <CountryDetails countryInfo={filteredCountries[0]} />
    )
  }
  else {
    if (filteredCountries.length > 10) {
      return (<p>Too many matches, specify another filter</p>);
    }
    else if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map(c => <li key={c.name.common}>{c.name.common}</li>)}
        </ul>
      );
    }
  }
};

export default CountryInfo;