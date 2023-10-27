/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handlePostEmployee } from './employee';
import { aboutMe as handleAboutMe } from './me';
import {
	getOrganizationChart as handleGetOrganizationChart,
	postOrganizationChart as handlePostOrganizationChart,
} from './organization-chart';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	ORG_KV: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const handleRequest = async (request: Request, env: Env): Promise<Response> => {
	const { pathname } = new URL(request.url);

	if (pathname === '' || pathname === '/') {
		return new Response('Hello world!');
	} else if (pathname === '/me') {
		return handleAboutMe();
	} else if (request.method === 'GET' && pathname === '/organization-chart') {
		return handleGetOrganizationChart(request, env.ORG_KV);
	} else if (request.method === 'POST' && pathname === '/organization-chart') {
		return handlePostOrganizationChart(request, env.ORG_KV);
	} else if (request.method === 'POST' && pathname === '/employee') {
		return handlePostEmployee(request, env.ORG_KV);
	}

	return new Response('Not Found', { status: 404 });
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		return handleRequest(request, env);
	},
};
