import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Form, Input, Button, Checkbox, Card } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../styles/index.css';

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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onFinish = ({ email, password }) => {
    dispatch(getUserData(email, password));
  };

  useEffect(() => {
    if (user.data) history.push('/');
  }, [user, history]);

  return (
    <Layout id="login-layout">
      <Content>
        <Card
          id="login"
          title={
            <img
              src={process.env.PUBLIC_URL + 'frema_logo.svg'}
              alt="Logo Frema a.s."
            ></img>
          }
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
              name="password"
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
