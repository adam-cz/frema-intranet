import { Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCrmRecords } from '../../../../actions/crm';
import { loadCustomers } from '../../../../actions/customers';

import AddCrmRecord from './AddCrmRecord';
import TableSearch from '../../ui/TableSearch';
import RecordTextList from './RecordTextList';

const CRM = () => {
  const crmRecords = useSelector((state) => state.crm);
  const dispatch = useDispatch();
  const [recordCount, setRecordCount] = useState(crmRecords.length);

  const columns = [
    {
      title: 'Firma',
      dataIndex: ['client', 'company_name'],
      key: 'name',
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
      key: 'date',
      sorter: (a, b) => new Date(a.created.date) - new Date(b.created.date),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  useEffect(() => {
    dispatch(loadCustomers());
    dispatch(getCrmRecords());
  }, [dispatch, recordCount]);

  return (
    <div>
      <AddCrmRecord setCounter={setRecordCount} counter={recordCount} />
      <Divider orientation="left" plain />
      <TableSearch
        columns={columns}
        dataSource={crmRecords}
        expandable={{
          expandedRowRender: (record) => (
            <RecordTextList record={record.records} />
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      />
    </div>
  );
};

export default CRM;
