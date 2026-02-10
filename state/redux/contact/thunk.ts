import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContactFormData, ContactCategory } from '@/types';
import {
  getContactsApi,
  getContactsByCategoryApi,
  getContactByIdApi,
  createContactApi,
  updateContactApi,
  deleteContactApi,
} from './api';

export const getContactsAsync = createAsyncThunk(
  'contact/getContacts',
  async (_, { rejectWithValue }) => {
    try {
      return await getContactsApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener contactos',
      });
    }
  }
);

export const getContactsByCategoryAsync = createAsyncThunk(
  'contact/getContactsByCategory',
  async (category: ContactCategory, { rejectWithValue }) => {
    try {
      const data = await getContactsByCategoryApi(category);
      return { category, data };
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener contactos por categoría',
      });
    }
  }
);

export const getContactByIdAsync = createAsyncThunk(
  'contact/getContactById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getContactByIdApi(id);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener contacto',
      });
    }
  }
);

export const createContactAsync = createAsyncThunk(
  'contact/createContact',
  async (contactData: ContactFormData, { rejectWithValue }) => {
    try {
      return await createContactApi(contactData);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al crear contacto',
      });
    }
  }
);

export const updateContactAsync = createAsyncThunk(
  'contact/updateContact',
  async (
    params: { id: string; data: Partial<ContactFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await updateContactApi(params.id, params.data);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al actualizar contacto',
      });
    }
  }
);

export const deleteContactAsync = createAsyncThunk(
  'contact/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteContactApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al eliminar contacto',
      });
    }
  }
);
