import { Table, Input, Button, Space, Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCrmRecords } from '../../../../actions/crm';
import { getCustomers } from '../../../../actions/customers';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import AddCrmRecord from './AddCrmRecord';
import { isEqual, get } from 'lodash';

const CRM = () => {
  const crmRecords = useSelector((state) => state.crm);
  const customers = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(crmRecords.length);
  const [state, setState] = useState({
    searchText: '',
    searchedColumn: '',
  });
  let searchInput;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Hledaný výraz`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Hledej
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Vynulovat
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filtruj
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      get(record, dataIndex)
        ? get(record, dataIndex)
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      isEqual(state.searchedColumn, dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: '' });
  };

  const columns = [
    {
      title: 'Firma',
      dataIndex: ['client', 'company_name'],
      key: 'name',
      width: '15%',
      ...getColumnSearchProps(['client', 'company_name']),
    },
    {
      title: 'Předmět',
      dataIndex: 'subject',
      key: 'subject',
      width: '20%',
      ...getColumnSearchProps('subject'),
    },
    {
      title: 'Datum zápisu',
      dataIndex: ['created', 'date'],
      key: 'date',
      sorter: (a, b) => new Date(a.created.date) - new Date(b.created.date),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getCrmRecords());
    console.log(counter);
  }, [dispatch, counter]);

  return (
    <div>
      <AddCrmRecord setCounter={setCounter} counter={counter} />
      <Divider orientation="left" plain />
      <Table
        columns={columns}
        dataSource={crmRecords}
        expandable={{
          expandedRowRender: (record) =>
            record.records.map((el) => (
              <p style={{ margin: 0 }}>
                {el.text} - {el.created.date} - {el.created.id}
              </p>
            )),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      />
    </div>
  );
};

export default CRM;
