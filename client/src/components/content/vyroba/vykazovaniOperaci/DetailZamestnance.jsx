import { Alert } from 'antd';

const DetailZamestnance = ({ zamestnanci, vykazy }) => {
  /*

Jmeno
Celkova odpracovaná mzda
fond práce
z toho vykazano
z toho prestavky
produktivita (vyuziti pracovni doby)
produktivita (cas vykazu vs plan)

*/

  return (
    <div>
      {zamestnanci.length > 1 && (
        <Alert
          message="Zobrazená data zahrnují všechny zaměstnance z vybraného časového rozmezí. Pro statistiky konkrétního zaměstnance nastavte filtr"
          type="warning"
          showIcon
        />
      )}
    </div>
  );
};

export default DetailZamestnance;
