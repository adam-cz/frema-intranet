import { Divider, Space, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCrmRecords } from '../../../../actions/crm';
import { loadCustomers } from '../../../../actions/customers';
import { deleteCrmRecord } from '../../../../api/index';

import AddCrmRecord from './AddCrmRecord';
import TableSearch from '../../ui/TableSearch';
import RecordTextList from './RecordTextList';
import CrmProgressBar from './CrmProgressBar';
import AddTextRecord from './AddTextRecord';

const CRM = () => {
  const crmRecords = useSelector((state) => state.crm);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState('false');

  const deleteRecord = async (id) => {
    await deleteCrmRecord(id);
    dispatch(getCrmRecords());
  };

  const columns = [
    {
      title: 'Firma',
      dataIndex: ['client', 'company_name'],
      key: ['client', 'company_name'],
      width: '15%',
      searchIndex: ['client', 'company_name'],
    },
    {
      title: 'Předmět',
      dataIndex: 'subject',
      key: 'subject',
      width: '20%',
      searchIndex: 'subject',
    },
    {
      title: 'Datum zápisu',
      dataIndex: ['created', 'date'],
      key: ['created', 'date'],
      width: '15%',
      sorter: (a, b) => new Date(a.created.date) - new Date(b.created.date),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Obchodník',
      dataIndex: ['created', 'name'],
      key: ['created', 'name'],
      width: '15%',
      searchIndex: ['created', 'name'],
    },
    {
      title: 'Stav',
      dataIndex: 'coms',
      key: 'coms',
      render: (coms) => <CrmProgressBar coms={coms} />,
    },
    {
      title: 'Akce',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button>Upravit</Button>
          <Button
            disabled={
              user.data.role.includes('admin')
                ? false
                : record.created.id !== user.data._id
            }
            onClick={() => deleteRecord(record._id)}
            danger
          >
            X
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    dispatch(loadCustomers());
    dispatch(getCrmRecords());
  }, [dispatch, refresh]);

  return (
    <div>
      <AddCrmRecord refresh={refresh} setRefresh={setRefresh} />
      <Divider orientation="left" plain />
      <TableSearch
        columns={columns}
        dataSource={crmRecords.data}
        loading={crmRecords.loading}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <RecordTextList record={record.records} />
              <Divider orientation="left" plain />
              <AddTextRecord
                record={record}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </div>
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      />
    </div>
  );
};

export default CRM;
