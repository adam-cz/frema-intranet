import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Form, Input, Button, Checkbox, Card } from 'antd';
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

function Login() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [heslo, setHeslo] = useState('');

  const onFinish = (values) => {
    //console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const submitHandler = async (event) => {
    dispatch(getUserData(email, heslo));

    event.preventDefault();
  };

  // useEffect(() => {
  //   if (userData) localStorage.setItem('token', userData.accessToken);
  // }, [userData]);

  return (
    <Layout id="login-layout">
      <Content>
        <Card
          id="login"
          title={<img src="frema_logo.svg" alt="Logo Frema a.s."></img>}
        >
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: 'Zadejte svůj firemní mail!' },
              ]}
            >
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Heslo"
              name="heslo"
              rules={[{ required: true, message: 'Zadejte heslo!' }]}
            >
              <Input.Password
                value={heslo}
                onChange={(event) => setHeslo(event.target.value)}
              />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Pamatovat si mě</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" onClick={submitHandler}>
                Přihlásit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}

export default Login;
