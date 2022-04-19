import React, { useState } from 'react';
import styles from './Accordion.scss';
import { Table, Tag, Space } from 'antd';

const Accordion = ({ title, content, type }) => {
  const [isActive, setIsActive] = useState(false);
  const column = [
   
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
  ]
  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>
          <b>{title}</b>
        </div>

        <div className={`${styles.AccordionIcon}`}>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && <div className="accordion-content">
        {type && type === "UserGroup" && <ul>
          {content.length > 0 ? content &&
          
            <Table columns={column} dataSource={content} pagination={false}/>
            : <div>No User In This Group</div>}
        </ul>}

      </div>}
    </div>
  );
};

export default Accordion;