/**
 * UI Slice Tests
 * Tests for UI state management including theme, language, notifications, etc.
 */

const {
  default: uiReducer,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  markNotificationsAsRead,
  openModal,
  closeModal,
  setLoading,
  selectSidebarOpen,
  selectTheme,
  selectLanguage,
  selectNotifications,
  selectUnreadNotificationsCount,
  selectActiveModal,
  selectModalData,
  selectLoading,
} = require('../../../src/store/slices/uiSlice');
const { DEFAULT_LANGUAGE } = require('../../../src/utils/languageUtils');

describe('UI Slice', () => {
  // Initial state tests
  describe('initial state', () => {
    it('should return the initial state', () => {
      const initialState = {
        sidebarOpen: false,
        theme: 'light',
        language: DEFAULT_LANGUAGE,
        notifications: [],
        unreadNotificationsCount: 0,
        activeModal: null,
        modalData: null,
        loading: {},
      };
      
      expect(uiReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  // Reducer tests
  describe('reducers', () => {
    it('should handle toggleSidebar', () => {
      const initialState = {
        sidebarOpen: false,
      };
      
      const nextState = uiReducer(initialState, toggleSidebar());
      
      expect(nextState.sidebarOpen).toBe(true);
      
      const finalState = uiReducer(nextState, toggleSidebar());
      
      expect(finalState.sidebarOpen).toBe(false);
    });

    it('should handle setSidebarOpen', () => {
      const initialState = {
        sidebarOpen: false,
      };
      
      const nextState = uiReducer(initialState, setSidebarOpen(true));
      
      expect(nextState.sidebarOpen).toBe(true);
      
      const finalState = uiReducer(nextState, setSidebarOpen(false));
      
      expect(finalState.sidebarOpen).toBe(false);
    });

    it('should handle setTheme', () => {
      const initialState = {
        theme: 'light',
      };
      
      const nextState = uiReducer(initialState, setTheme('dark'));
      
      expect(nextState.theme).toBe('dark');
    });

    it('should handle setLanguage', () => {
      const initialState = {
        language: 'en',
      };
      
      const nextState = uiReducer(initialState, setLanguage('id'));
      
      expect(nextState.language).toBe('id');
    });

    it('should handle addNotification', () => {
      const initialState = {
        notifications: [],
        unreadNotificationsCount: 0,
      };
      
      const notification = {
        id: '1',
        type: 'success',
        message: 'Test notification',
        read: false,
      };
      
      const nextState = uiReducer(initialState, addNotification(notification));
      
      expect(nextState.notifications).toHaveLength(1);
      expect(nextState.notifications[0]).toEqual(notification);
      expect(nextState.unreadNotificationsCount).toBe(1);
    });

    it('should handle removeNotification', () => {
      const initialState = {
        notifications: [
          { id: '1', type: 'success', message: 'Test notification 1', read: false },
          { id: '2', type: 'error', message: 'Test notification 2', read: false },
        ],
        unreadNotificationsCount: 2,
      };
      
      const nextState = uiReducer(initialState, removeNotification('1'));
      
      expect(nextState.notifications).toHaveLength(1);
      expect(nextState.notifications[0].id).toBe('2');
    });

    it('should handle markNotificationsAsRead', () => {
      const initialState = {
        notifications: [
          { id: '1', type: 'success', message: 'Test notification 1', read: false },
          { id: '2', type: 'error', message: 'Test notification 2', read: false },
        ],
        unreadNotificationsCount: 2,
      };
      
      const nextState = uiReducer(initialState, markNotificationsAsRead());
      
      expect(nextState.notifications.every(notification => notification.read)).toBe(true);
      expect(nextState.unreadNotificationsCount).toBe(0);
    });

    it('should handle openModal', () => {
      const initialState = {
        activeModal: null,
        modalData: null,
      };
      
      const modalPayload = {
        modalType: 'confirmDelete',
        data: { id: '123', name: 'Test Item' },
      };
      
      const nextState = uiReducer(initialState, openModal(modalPayload));
      
      expect(nextState.activeModal).toBe(modalPayload.modalType);
      expect(nextState.modalData).toEqual(modalPayload.data);
    });

    it('should handle closeModal', () => {
      const initialState = {
        activeModal: 'confirmDelete',
        modalData: { id: '123', name: 'Test Item' },
      };
      
      const nextState = uiReducer(initialState, closeModal());
      
      expect(nextState.activeModal).toBe(null);
      expect(nextState.modalData).toBe(null);
    });

    it('should handle setLoading', () => {
      const initialState = {
        loading: {},
      };
      
      const nextState = uiReducer(initialState, setLoading({ key: 'fetchUsers', value: true }));
      
      expect(nextState.loading.fetchUsers).toBe(true);
      
      const finalState = uiReducer(nextState, setLoading({ key: 'fetchUsers', value: false }));
      
      expect(finalState.loading.fetchUsers).toBe(false);
    });
  });

  // Selector tests
  describe('selectors', () => {
    const state = {
      ui: {
        sidebarOpen: true,
        theme: 'dark',
        language: 'id',
        notifications: [
          { id: '1', type: 'success', message: 'Test notification 1', read: false },
          { id: '2', type: 'error', message: 'Test notification 2', read: true },
        ],
        unreadNotificationsCount: 1,
        activeModal: 'confirmDelete',
        modalData: { id: '123', name: 'Test Item' },
        loading: {
          fetchUsers: true,
        },
      },
    };

    it('should select sidebarOpen', () => {
      expect(selectSidebarOpen(state)).toBe(state.ui.sidebarOpen);
    });

    it('should select theme', () => {
      expect(selectTheme(state)).toBe(state.ui.theme);
    });

    it('should select language', () => {
      expect(selectLanguage(state)).toBe(state.ui.language);
    });

    it('should select notifications', () => {
      expect(selectNotifications(state)).toEqual(state.ui.notifications);
    });

    it('should select unreadNotificationsCount', () => {
      expect(selectUnreadNotificationsCount(state)).toBe(state.ui.unreadNotificationsCount);
    });

    it('should select activeModal', () => {
      expect(selectActiveModal(state)).toBe(state.ui.activeModal);
    });

    it('should select modalData', () => {
      expect(selectModalData(state)).toEqual(state.ui.modalData);
    });

    it('should select loading state by key', () => {
      expect(selectLoading(state, 'fetchUsers')).toBe(true);
      expect(selectLoading(state, 'nonExistentKey')).toBe(false);
    });
  });
});
