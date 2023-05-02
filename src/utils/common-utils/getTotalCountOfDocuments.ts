import { Collection, Document, Filter } from "mongodb";

export const getTotalCountOfDocuments = async <T extends Document>(
  collection: Collection<T>,
  filter: Filter<T>
) => {
  return await collection.countDocuments(filter);
};