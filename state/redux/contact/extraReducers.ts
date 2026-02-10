import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ContactSlice } from '@/types';
import {
  getContactsAsync,
  getContactsByCategoryAsync,
  getContactByIdAsync,
  createContactAsync,
  updateContactAsync,
  deleteContactAsync,
} from './thunk';

const extraReducersContact = (builder: ActionReducerMapBuilder<ContactSlice>) => {
  builder
    .addCase(getContactsAsync.pending, (state) => {
      state.status.getContactsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getContactsAsync.fulfilled, (state, action) => {
      state.contacts = action.payload;
      state.emergencyContacts = action.payload.filter(
        (c) => c.category === 'emergencia'
      );
      state.administrativeContacts = action.payload.filter(
        (c) => c.category === 'administrativo'
      );
      state.serviceContacts = action.payload.filter(
        (c) => c.category === 'servicios'
      );
      state.lastFetched['contacts'] = Date.now();
      state.status.getContactsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getContactsAsync.rejected, (state, action: any) => {
      state.status.getContactsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener contactos',
        loading: false,
      };
    });

  builder
    .addCase(getContactsByCategoryAsync.pending, (state) => {
      state.status.getContactsByCategoryAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getContactsByCategoryAsync.fulfilled, (state, action) => {
      const { category, data } = action.payload;
      if (category === 'emergencia') {
        state.emergencyContacts = data;
      } else if (category === 'administrativo') {
        state.administrativeContacts = data;
      } else if (category === 'servicios') {
        state.serviceContacts = data;
      }
      state.lastFetched[`contacts.${category}`] = Date.now();
      state.status.getContactsByCategoryAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getContactsByCategoryAsync.rejected, (state, action: any) => {
      state.status.getContactsByCategoryAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener contactos por categoría',
        loading: false,
      };
    });

  builder
    .addCase(getContactByIdAsync.pending, (state) => {
      state.status.getContactByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getContactByIdAsync.fulfilled, (state) => {
      state.status.getContactByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getContactByIdAsync.rejected, (state, action: any) => {
      state.status.getContactByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener contacto',
        loading: false,
      };
    });

  builder
    .addCase(createContactAsync.pending, (state) => {
      state.status.createContactAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createContactAsync.fulfilled, (state, action) => {
      state.contacts.push(action.payload);
      const category = action.payload.category;
      if (category === 'emergencia') {
        state.emergencyContacts.push(action.payload);
      } else if (category === 'administrativo') {
        state.administrativeContacts.push(action.payload);
      } else if (category === 'servicios') {
        state.serviceContacts.push(action.payload);
      }
      state.lastFetched = {};
      state.status.createContactAsync = {
        response: 'fulfilled',
        message: 'Contacto creado correctamente',
        loading: false,
      };
    })
    .addCase(createContactAsync.rejected, (state, action: any) => {
      state.status.createContactAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear contacto',
        loading: false,
      };
    });

  builder
    .addCase(updateContactAsync.pending, (state) => {
      state.status.updateContactAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateContactAsync.fulfilled, (state, action) => {
      const index = state.contacts.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      state.lastFetched = {};
      state.status.updateContactAsync = {
        response: 'fulfilled',
        message: 'Contacto actualizado correctamente',
        loading: false,
      };
    })
    .addCase(updateContactAsync.rejected, (state, action: any) => {
      state.status.updateContactAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar contacto',
        loading: false,
      };
    });

  builder
    .addCase(deleteContactAsync.pending, (state) => {
      state.status.deleteContactAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteContactAsync.fulfilled, (state, action) => {
      state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      state.emergencyContacts = state.emergencyContacts.filter(
        (c) => c.id !== action.payload
      );
      state.administrativeContacts = state.administrativeContacts.filter(
        (c) => c.id !== action.payload
      );
      state.serviceContacts = state.serviceContacts.filter(
        (c) => c.id !== action.payload
      );
      state.lastFetched = {};
      state.status.deleteContactAsync = {
        response: 'fulfilled',
        message: 'Contacto eliminado correctamente',
        loading: false,
      };
    })
    .addCase(deleteContactAsync.rejected, (state, action: any) => {
      state.status.deleteContactAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar contacto',
        loading: false,
      };
    });
};

export default extraReducersContact;
