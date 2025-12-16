import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const POST = async (req: Request, props: any) => {
  console.log("Auth API Request POST:", req.url);
  return handler.POST(req);
};

export const GET = async (req: Request, props: any) => {
  console.log("Auth API Request GET:", req.url);
  return handler.GET(req);
};
