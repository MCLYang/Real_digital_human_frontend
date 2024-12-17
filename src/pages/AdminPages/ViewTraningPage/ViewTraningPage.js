import React from 'react';
import { Space, Table, Tag,Typography } from 'antd';
const columns = [
  {
    title: 'Time',
    dataIndex: 'Time',
    key: 'Time',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Training Status',
    dataIndex: 'trainingStatus',
    key: 'trainingStatus',
    render: (_, { trainingStatus }) => {
      let color;
      switch (trainingStatus) {
        case 'Completed':
          color = 'green';
          break;
        case 'In Progress':
          color = 'blue';
          break;
        case 'Not Started':
          color = 'orange';
          break;
        case 'Failed':
          color = 'volcano';
          break;
        default:
          color = 'default';
          break;
      }
      return (
        <Tag color={color} key={trainingStatus}>
          {trainingStatus}
        </Tag>
      );
    },
  },
  {
    title: 'Creator',
    dataIndex: 'Creator',
    key: 'Creator',
  },
  {
    title: 'User',
    key: 'User',
    dataIndex: 'User',
   
  },
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Add {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];
const data = [
  {
    key: '1',
    Time: '2024.12.8 16:34:11',
    trainingStatus: "Completed",
    Creator: '@sally',
    User: "joy",
  },
  {
    key: '2',
    Time: '2024.11.8 16:34:11',
    trainingStatus: "Failed",
    Creator: '@sally',
    User: "joy",
  },
  {
    key: '3',
    Time: '2024.12.8 16:34:11',
    trainingStatus: "Not Started",
    Creator: '@sally',
    User: "joy",
  },
  {
    key: '4',
    Time: '2024.11.8 16:34:11',
    trainingStatus: "In Progress",
    Creator: '@sally',
    User: "joy",
  },
];
const ViewTraningPage = () => 
<Table
 columns={columns}
 dataSource={data}
 title={()=>{return (
       <Typography.Title
       level={1}
       style={{
         margin: 0,
       }}
     >
      Training Dashboard
     </Typography.Title>
   )}
}
 />;
export default ViewTraningPage;