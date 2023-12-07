import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Layout, Typography, Form } from 'antd';
// import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Users = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: form.getFieldValue('name') }),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      form.resetFields();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: form.getFieldValue('name') }),
      });
      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setSelectedUser(null);
      form.resetFields();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({ name: user.name });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', color: 'white' }}>
        <Title level={3} style={{ color: 'white', textAlign: 'center' }}>
          Users Page
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Table dataSource={users} columns={columns} Key= {users.id} />
        <Form form={form} layout="inline" style={{ marginTop: '20px', justifyContent: 'center' }}>
          <Form.Item name="name">
            <Input placeholder="Enter user name" />
          </Form.Item>
          {selectedUser ? (
            <Button type="primary" onClick={handleUpdate}>
              Update User
            </Button>
          ) : (
            <Button type="primary" onClick={handleCreate}>
              Create User
            </Button>
          )}
        </Form>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Button type="link" onClick={handleLogout}>
          Logout
        </Button>
      </Footer>
    </Layout>
  );
};

export default Users;
