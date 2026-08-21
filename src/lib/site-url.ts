import "server-only";

export function getSiteUrl(){const vercelHost=process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.VERCEL_URL;if(process.env.VERCEL&&vercelHost)return `https://${vercelHost}`;return process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}
