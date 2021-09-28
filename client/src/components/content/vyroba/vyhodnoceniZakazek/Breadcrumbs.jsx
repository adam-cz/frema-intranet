import { Breadcrumb } from 'antd';
import { useHistory } from 'react-router-dom';

const Breadcrumbs = ({ objednavka, final, opv }) => {
  const history = useHistory();

  return (
    <Breadcrumb>
      <Breadcrumb.Item
        style={{ cursor: 'pointer' }}
        onClick={() => history.push('/vyroba/zakazky/')}
      >
        Hlavní výběr
      </Breadcrumb.Item>
      <Breadcrumb.Item
        style={{ cursor: 'pointer' }}
        onClick={() => history.push(`/vyroba/zakazky/${objednavka}`)}
      >
        {objednavka}
      </Breadcrumb.Item>
      {final && (
        <Breadcrumb.Item
          style={{ cursor: 'pointer' }}
          onClick={() => history.push(`/vyroba/zakazky/${objednavka}/${final}`)}
        >
          {final}
        </Breadcrumb.Item>
      )}
      {opv && <Breadcrumb.Item>{opv}</Breadcrumb.Item>}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
