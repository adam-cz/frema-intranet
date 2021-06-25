import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Form, Input, Button, Checkbox, Card } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../styles/index.css';

import { silentRefresh } from '../../api';
import { getUserData } from '../../actions/user';

const { Content } = Layout;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onFinish = (values) => {
    dispatch(getUserData(values.email, values.heslo));
    silentRefresh();
    history.push('/');
  };

  useEffect(() => {
    //dispatch(getUserData());
    //console.log(props.history.location);
    //if (userData) props.history.goBack();
    // if (userData) history.push('/');
  }, [dispatch]);

  return (
    <Layout id="login-layout">
      <Content>
        <Card
          id="login"
          title={<img src="frema_logo.svg" alt="Logo Frema a.s."></img>}
        >
          <Form
            {...layout}
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: 'Zadejte svůj firemní mail!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Heslo"
              name="heslo"
              rules={[{ required: true, message: 'Zadejte heslo!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Pamatovat si mě</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Přihlásit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
