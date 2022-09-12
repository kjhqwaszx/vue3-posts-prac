import axios from 'axios';

function create(baseURL, options) {
	const instance = axios.create({
		baseURL,
		...options,
	});
	return instance;
}

// export const posts = create('http://localhost:5000/posts');
/**
 * 호출하는 api url에 따라 모듈화 시킨다.
 */
export const posts = create(`${import.meta.env.VITE_APP_API_URL}posts`);
