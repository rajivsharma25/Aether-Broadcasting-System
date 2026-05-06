// Simple IndexedDB wrapper for large data storage in a mock environment
const DB_NAME = 'AetherDB';
const STORE_NAME = 'content';
const DB_VERSION = 1;

/**
 * Service to handle all content-related operations.
 * Uses IndexedDB for high-capacity local data persistence (supporting 10MB+ files).
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

const ContentService = {
  /**
   * Retrieves and filters broadcasting content based on criteria
   */
  getContent: async (filters = {}) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        let content = request.result || [];
        // Sort by createdAt descending
        content.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (filters.status) {
          content = content.filter(c => c.status === filters.status);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          content = content.filter(c => 
            c.title.toLowerCase().includes(s) || 
            c.subject.toLowerCase().includes(s)
          );
        }
        if (filters.teacherId) {
          content = content.filter(c => c.teacherId === filters.teacherId);
        }
        resolve(content);
      };
      request.onerror = () => reject(request.error);
    });
  },

  uploadContent: async (data) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const newEntry = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      const request = store.add(newEntry);
      request.onsuccess = () => resolve(newEntry);
      request.onerror = (e) => {
        if (e.target.error.name === 'QuotaExceededError') {
          reject(new Error('Browser storage is full. Please clear your browser data or try a smaller file.'));
        } else {
          reject(e.target.error);
        }
      };
    });
  },

  updateStatus: async (id, status, rejectionReason = null) => {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          item.rejectionReason = rejectionReason;
          store.put(item).onsuccess = () => resolve({ success: true });
        } else {
          reject(new Error('Item not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  },

  getStats: async (teacherId = null) => {
    const content = await ContentService.getContent({ teacherId });
    return {
      total: content.length,
      pending: content.filter(c => c.status === 'pending').length,
      approved: content.filter(c => c.status === 'approved').length,
      rejected: content.filter(c => c.status === 'rejected').length,
    };
  }
};

export default ContentService;
