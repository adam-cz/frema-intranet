import { Table, Input, Button, Space, Divider } from 'antd';
import AddCustomer from './AddCustomer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCustomers } from '../../../../actions/customers';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const Customer = () => {
  const customers = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(customers.length);
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
      record[dataIndex]
        ? record[dataIndex]
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
      state.searchedColumn === dataIndex ? (
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
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'IČO',
      dataIndex: 'ico',
      key: 'ico',
      width: '20%',
      ...getColumnSearchProps('ico'),
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
  }, [dispatch, counter]);

  return (
    <div>
      <AddCustomer setCounter={setCounter} counter={counter} />
      <Divider orientation="left" plain />
      <Table
        columns={columns}
        dataSource={customers}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.name}</p>
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      />
    </div>
  );
};

export default Customer;
