import { NextApiResponse } from "next";

export default interface ApiResponse<T> extends NextApiResponse<T> {}
