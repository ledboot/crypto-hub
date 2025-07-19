import { NextRequest } from 'next/server'
import axios from 'axios'

// --- Server-Side API Factory ---
export const createServerApi = (request: NextRequest) => {
	const serverApi = axios.create({
		timeout: 10000,
		timeoutErrorMessage: 'Request timed out',
	})
	return serverApi
}
