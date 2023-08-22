import { useLazyQuery } from '@apollo/client';
import { Col, Row, message } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import TPTable from 'components/base/components/TPTable';
import { BackArrowIcon } from 'components/core/Icons';
import { GET_WEEKLY_SUBSCRIBER } from 'graphql/queries';
import '../../../assets/styles/weekly-subscriber.less';

export default function WeeklySubscriber({
  startDate,
  endDate,
  search,
  backToPrevPage,
}) {
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
        const { getWeeklySubscribers } = data;
        const { items, meta } = getWeeklySubscribers;
        const updatedItems =
          page > 1 ? [...weeklySubscriber.items, ...items] : items;

        setWeeklySubscriber({ ...weeklySubscriber, items: updatedItems, meta });
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
        onClick={backToPrevPage}
      >
        <BackArrowIcon /> &nbsp; BACK
      </Row>
      <Row>
        <Col className="text-h4 fw-500" span={18}>
          weekly subscriber ({startDate} to {endDate})
        </Col>
      </Row>
      <Row>
        <TPTable
          className="subscriber-tbl"
          columns={weeklySubscriberColumn}
          dataSource={items}
          height={550}
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
  backToPrevPage: PropTypes.func.isRequired,
};
