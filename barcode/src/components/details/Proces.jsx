import { useEffect, useState } from 'react';

const Proces = ({ proces, setInput, setProces, input }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && input) setProces();
  }, [loading, setProces, input]);

  return (
    <div
      className="ctverec"
      onClick={() => {
        setInput(`${proces.opv}_${proces.polozka}_${proces.stroj}`);
        setLoading(false);
      }}
    >
      <span>
        Zakázkový postup: <b>{proces.opv}</b>
      </span>
      <span>
        Položka: <b>{proces.polozka}</b>
      </span>
      {proces.stroj !== 'null' && (
        <span>
          Stroj: <b>{proces.stroj}</b>
        </span>
      )}
    </div>
  );
};

export default Proces;