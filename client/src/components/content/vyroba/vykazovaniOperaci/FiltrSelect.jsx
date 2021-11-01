import { Select } from 'antd';

const { Option } = Select;

export const FiltrSelect = ({ data, setDataFiltered, filtr, setFiltr }) => {
  return (
    <Select
      showSearch
      value={filtr.zamestnanecId}
      style={{ width: 200 }}
      placeholder="Vyberte zaměstnance"
      onChange={(value) => {
        setFiltr({ ...filtr, zamestnanecId: value });
        setDataFiltered({
          zamestnanci: data.zamestnanci.filter(
            (zamestnanec) => zamestnanec.id === value || !value
          ),
          vykazy: data.vykazy.filter(
            (vykaz) => vykaz.group === value || !value
          ),
        });
      }}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      <Option
        key={'vsichni'}
        value={null}
        onChange={() => setFiltr({ ...filtr, zamestnanecId: null })}
      >
        Všichni
      </Option>
      {data.zamestnanci.map((zamestnanec) => (
        <Option key={zamestnanec.id} value={zamestnanec.id}>
          {zamestnanec.title}
        </Option>
      ))}
    </Select>
  );
};

export default FiltrSelect;
