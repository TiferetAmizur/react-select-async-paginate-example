const cities = ["רמת גן", "תל אביב", "פתח תקווה"];

export const getCities = () => {
  const res = cities.map((value, key) => ({
    value: key,
    label: value
  }));

  return res;
};

export const getStreets = (city) => {
  return new Promise((resolve) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(
      `https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=${city}&limit=100000`,
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        let list = json.result.records.map((value, key) => ({
          value: key,
          label: value.שם_רחוב
        }));

        return setTimeout(() => {
          // console.log(list[0]);
          resolve(list);
        }, 1000);
      });
  });
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const loadStreetOptions = async (search, prevOptions, city) => {
  await sleep(1);
  console.log(city);
  let filteredOptions = city
    ? await getStreets(city.label)
    : // : await getStreets("", prevOptions);//to get all streets
      [];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredOptions = filteredOptions.filter(({ label }) =>
      label.toLowerCase().includes(searchLower)
    );
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10;
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10
  );

  return {
    options: slicedOptions,
    hasMore
  };
};
