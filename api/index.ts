import app from "../backend/src/index";

// Ensure Vercel receives a request handler function.
export default function handler(req: any, res: any) {
	return (app as unknown as (req: any, res: any) => void)(req, res);
}
