/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
import { useLazyQuery } from '@apollo/client';
import { Col, Row, message } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Input from 'components/base/components/Input';
import Table from 'components/base/components/Table';
import { BackArrowIcon } from 'components/core/Icons';
import '../../../assets/styles/weekly-subscriber.less';
import { GET_WEEKLY_SUBSCRIBER } from 'graphql/queries';

export default function WeeklySubscriber({ startDate, endDate, search, back }) {
  const [getWeeklySubscribers] = useLazyQuery(GET_WEEKLY_SUBSCRIBER);
  const [weeklySubscriber, setWeeklySubscriber] = useState({
    items: [],
    meta: {
      totalItems: 0,
    },
  });

  const fetchWeeklySubscribers = (search, page, limit) => {
    getWeeklySubscribers({
      variables: { startDate, endDate, search, page, limit },
    })
      .then(({ data }) => {
        if (data === undefined) {
          setWeeklySubscriber({
            ...weeklySubscriber,
            items: [],
            meta: { totalItems: 0 },
          });
        } else if (search.length === 0) {
          const { getWeeklySubscribers } = data;
          const { items, meta } = getWeeklySubscribers;
          const allItems = [...weeklySubscriber.items, ...items];
          setWeeklySubscriber({ ...weeklySubscriber, items: allItems, meta });
        } else {
          const { getWeeklySubscribers } = data;
          const { items, meta } = getWeeklySubscribers;
          setWeeklySubscriber({ ...weeklySubscriber, items, meta });
        }
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };

  useEffect(() => {
    fetchWeeklySubscribers(search, 1, 15);
  }, []);
  const weeklySubscriberColumn = [
    {
      title: 'Email',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Date of Subscribe',
      dataIndex: 'subScriberDate',
      key: 'subScriberDate',
      sorter: (a, b) => new Date(a.subScriberDate) - new Date(b.subScriberDate),
    },
    {
      title: 'Subscribe days',
      dataIndex: 'subScribedDays',
      key: 'subScribedDays',
      sorter: (a, b) => a.subScribedDays - b.subScribedDays,
    },
    {
      title: 'Entry fee',
      dataIndex: 'entryFee',
      key: 'entryFee',
      sorter: (a, b) => a.entryFee - b.entryFee,
    },
  ];

  const { items, meta } = weeklySubscriber;
  const { totalItems } = meta;

  return (
    <>
      <Row
        className="text-medium font-alegreya mb-20 pointer back-arrow"
        onClick={back}
      >
        <BackArrowIcon /> &nbsp; BACK
      </Row>
      <Row>
        <Col className="text-h4 fw-500" span={18}>
          weekly subscriber ({startDate} to {endDate})
        </Col>
      </Row>
      <Row>
        <Table
          className="subscriber-tbl"
          columns={weeklySubscriberColumn}
          dataSource={items}
          loadMoreFunc={fetchWeeklySubscribers}
          totalCount={totalItems}
          type="search"
        />
      </Row>
    </>
  );
}

WeeklySubscriber.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  back: PropTypes.func.isRequired,
};
