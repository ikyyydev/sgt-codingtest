import axios from "axios";
import { useEffect, useState } from "react";
function useFetchdata(apiEndpoint: string) {
  const [alldata, setAlldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchAlldata = async () => {
      try {
        const res = await axios.get(apiEndpoint);
        const alldata = res.data;
        setAlldata(alldata);
        setLoading(false);
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    // fetch blog data only if category exists
    if (apiEndpoint) {
      fetchAlldata();
    }
  }, [initialLoad, apiEndpoint]); // depend on initialload and endpoint to trigger api category

  return { alldata, loading };
}

export default useFetchdata;
