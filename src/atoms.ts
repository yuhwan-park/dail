import dayjs from 'dayjs';
import { Params } from 'react-router-dom';
import { atom, selector } from 'recoil';
import { IDocument, IMyList, IUserState } from 'types';

export const userState = atom<IUserState>({
  key: 'user',
  default: {
    displayName: '',
    uid: '',
    photoURL: '',
    email: '',
  },
});

export const paramState = atom<Params<string>>({
  key: 'param',
  default: {},
});

export const myListModalState = atom<'Edit' | 'Create' | 'Delete' | null>({
  key: 'myListModal',
  default: null,
});

export const dateState = atom<dayjs.Dayjs>({
  key: 'date',
  default: dayjs(),
});

export const dateSelector = selector<string>({
  key: 'dateSelector',
  get: ({ get }) => get(dateState).format('YYYYMMDD'),
});

export const toggleMenuState = atom({
  key: 'toggleMenu',
  default: true,
});

// ******************
// * Document State *
// ******************

export const documentState = atom<IDocument[]>({
  key: 'todo',
  default: [],
});

export const myListsState = atom<IMyList[]>({
  key: 'myLists',
  default: [],
});

export const myListDocsState = atom<IDocument[]>({
  key: 'myListDocs',
  default: [],
});

export const selectedDocumentState = selector<IDocument | undefined>({
  key: 'selectedDocumentSelector',
  get: ({ get }) => {
    const params = get(paramState);
    const documents = get(documentState);
    const myListDocs = get(myListDocsState);

    if (params['listId']) {
      return myListDocs.find(document => document.id === params['id']);
    }
    return documents.find(document => document.id === params['id']);
  },
});

export const selectedListState = selector({
  key: 'selectedListSelector',
  get: ({ get }) => {
    const params = get(paramState);
    const lists = get(myListsState);

    return lists.find(list => list.id === params['listId']);
  },
});
