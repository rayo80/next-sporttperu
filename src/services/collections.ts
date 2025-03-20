import axios from 'axios';

import api from './base';



export const collectionsService = {
  getAll: async (endpoint: string): Promise<Collection[]> => {
    const response = await api.get(endpoint);
    return response.data;
  },

};
