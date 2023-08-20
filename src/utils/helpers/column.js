const getColumn = (title, dataIndex, key, sorter, className) => ({
  title,
  dataIndex,
  key,
  sorter,
  className,
});

export const getColumnWithChildren = (title, key, className, children) => ({
  title,
  key,
  className,
  children,
});
export default getColumn;
