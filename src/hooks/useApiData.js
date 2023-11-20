import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useApiData = (url, method, bodyAndParams) => {
  const params = bodyAndParams?.params;
  const body = bodyAndParams?.body;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback((url, method, bodyAndParams) => {
    const params = bodyAndParams?.params;
    const body = bodyAndParams?.body;
    setLoading(true);
    axios({
      method,
      url,
      data: body,
      params,
    })
      .then((response) => {
        // Handle POST response
        console.log("POST Response:", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        // Handle POST error
        console.error("POST Error:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (url) fetchData(url, method, { params, body });
  }, [body, fetchData, method, params, url]);

  return { data, loading, error, fetchData };
};

export default useApiData;
