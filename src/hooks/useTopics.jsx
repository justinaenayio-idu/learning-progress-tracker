import { useEffect, useState } from "react";

function useTopics() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTopics() {
      try {
        setIsLoading(true);
        setFetchError("");

        const response = await fetch(
          "http://localhost:3001/api/topics",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Could not load topics. HTTP status: ${response.status}`
          );
        }

        const data = await response.json();
        setTopics(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setFetchError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchTopics();

    return () => {
      controller.abort();
    };
  }, []);

  return { topics, setTopics, isLoading, fetchError };
}

export default useTopics;