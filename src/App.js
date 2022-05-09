import React, { useState, useCallback, useEffect } from "react";
import "./styles.css";

import { getCities, getStreets, loadStreetOptions } from "./Utility/Utility";

import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

export default function App() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  const cities = getCities();

  useEffect(() => {
    //for basic select as city select
    async function fetchData() {
      // You can await here
      const streets = await getStreets(city);
      // ...
    }
    fetchData();
  }, []);

  const extendedLoadOptions = useCallback(
    async (search, prevOptions) => {
      const result = await loadStreetOptions(search, prevOptions, city);

      return result;
    },
    [city]
  );

  return (
    <React.Fragment>
      <div className="App">
        <h3>City Select Dropdown</h3>
        <Select
          value={city.lable}
          options={cities}
          onChange={(item) => {
            setCity(item);
            setStreet("");
          }}
        />
      </div>
      <br />
      <div className="App">
        <h3>Street Select Async Paginate Dropdown</h3>
        <AsyncPaginate
          value={street}
          loadOptions={extendedLoadOptions}
          onChange={(item) => {
            // console.log(item.value.slice(0, 2))
            setStreet(item);
            if (!city) {
              setCity(item.value);
            }
          }}
          cacheUniqs={[city]}
          shouldLoadMore={(scrollHeight, clientHeight, scrollTop) => {
            return scrollHeight - scrollTop < 1000;
          }}
        />
      </div>
    </React.Fragment>
  );
}
