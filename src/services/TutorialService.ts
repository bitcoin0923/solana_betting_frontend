import { http, http1 } from '../http-common';

export const setUserStakeInfo = (data: any) => http.post('/alphabets/setUserStakeInfo', data);

export const setUserUnstakeInfo = (data: any) => http.post('/tutorials/setUserUnstakeInfo', data);

export const setSingleStakeInfo = (data: any) => http.post('/tutorials/setSingleStakeInfo', data);

export const setSingleUnstakeInfo = (data: any) => http.post('/tutorials/setSingleUnstakeInfo', data);

export const createATA = (data: any) => http.post('/tutorials/createTA', data);

export const createLTA = (data: any) => http.post('/tutorials/createLTA', data);

export const mintKage = (data: any) => http.post('/tutorials/mintKage', data);

export const getAll = () => http.get('/tutorials');

export const get = (id: any) => http.get(`/tutorials/${id}`);

export const create = (data: any) => http.post('/tutorials', data);

export const update = (id: any, data: any) => http.put(`/tutorials/${id}`, data);

export const remove = (id: any) => http.delete(`/tutorials/${id}`);

export const removeAll = () => http.delete(`/tutorials`);

export const getState = (wallet: any, quest: any) => http.get(`/tutorials/getState?wallet=${wallet}&quest=${quest}`);

export const getRemainings = (wallet: any, quest: any) =>
  http.get(`/tutorials/getRemainings?wallet=${wallet}&quest=${quest}`);

export const updateState = (data: any) => http.post(`/tutorials/updateState`, data);

export const updateRemainings = (data: any) => http.post(`/tutorials/updateRemainings`, data);

export const findByTitle = (wallet: any, quest: any) => http.get(`/tutorials?wallet=${wallet}&quest=${quest}`);

export const shadowMint = (data: any) => http.post('/tutorials/shadowMint', data);

export const buyKage = (data: any) => http1.post('/v1/lootbox/buyKage', data);

export const getRandomLoot = (data: any) => http1.post('/v1/lootbox/getRandomLoot', data);

export const getTwitterFeeds = () => http1.get('/v1/twitter/get');
