import { Op, where, fn, col, literal } from "sequelize";

const searchTopicsCondition = (searchQuery: string) => {
  if (!searchQuery || searchQuery.trim() === "") {
    return {};
  }

  const query = searchQuery.trim();

  return {
    [Op.or]: [
      { title: { [Op.like]: `%${query}%` } },
      { description: { [Op.like]: `%${query}%` } },
      where(fn("JSON_CONTAINS", col("tags"), literal(`'"${query}"'`)), true),
    ],
  };
};

export default searchTopicsCondition;
