import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

//import actions
import { _getItems } from '../../actions/_';

const _Items = () => {
  //const _items = useSelector((state) => state._items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(_getItems());
  }, [dispatch]);

  return <div>Zaměstnanci</div>;
};

export default _Items;
