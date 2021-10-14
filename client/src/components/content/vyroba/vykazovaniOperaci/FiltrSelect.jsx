import { Select } from 'antd';

const { Option } = Select;

export const FiltrSelect = ({ filtr, setFiltr, setLoading, data }) => {
  return (
    <Select
      showSearch
      value={filtr.zamestnanecJmeno}
      style={{ width: 200 }}
      placeholder="Vyberte zaměstnance"
      onChange={(value, option) => {
        console.log(option);
        setFiltr({
          ...filtr,
          zamestnanecId: value,
          zamestnanecJmeno: option.children,
        });
        setLoading(true);
      }}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      <Option key={'vsichni'} value={null}>
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
