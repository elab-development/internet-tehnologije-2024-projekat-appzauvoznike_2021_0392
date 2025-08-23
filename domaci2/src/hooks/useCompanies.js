import { useEffect, useState } from "react";
import api from "../api/axios";

 
export default function useCompanies(endpoint = "/companies-public") {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get(endpoint);
        if (!active) return;
        // očekujemo niz objekata { id, name, type }
        setCompanies(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.response?.data?.message || "Greška pri učitavanju kompanija.");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [endpoint]);

  return { companies, loading, error };
}
