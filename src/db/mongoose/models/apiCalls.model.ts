import { model, Schema } from "mongoose";
import { ApiCallsDBType } from "../../../dto/apiCallsDTO/apiCallsDTO";

export const apiCallsSchema = new Schema<ApiCallsDBType>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});
// Api Calls / Rate Limiting Indexes
apiCallsSchema.index(
  {
    ip: 1,
    url: 1,
    date: -1,
  },
  { name: "rate_limit_lookup" },
);

//TTL index to automatically purge logs older than 20 seconds
apiCallsSchema.index(
  {
    date: 1,
  },
  { name: "rate_limit_ttl", expireAfterSeconds: 20 },
);

export const ApiCallsModel = model("ApiCalls", apiCallsSchema, "apiCalls");
