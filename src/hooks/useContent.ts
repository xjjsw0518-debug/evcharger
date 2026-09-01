import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 通用内容管理 Hook
 * 用于从服务器读取和保存各种内容类型（产品、博客、FAQ、关于页面等）
 * 
 * @param contentType 内容类型：products、categories、blog、faq、about、videos
 * @param defaultValue 默认值（当服务器没有数据时使用）
 */
export function useContent<T>(contentType: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const API_ENDPOINT = `/api/content/${contentType}`;

  // 从服务器读取内容
  const fetchFromServer = useCallback(async (): Promise<T | null> => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        console.error(`Failed to fetch ${contentType} from server:`, response.status);
        return null;
      }
      const result = await response.json();
      if (result.success && result.data !== null && result.data !== undefined) {
        return result.data as T;
      }
      return null;
    } catch (e) {
      console.error(`Error fetching ${contentType} from server:`, e);
      return null;
    }
  }, [API_ENDPOINT, contentType]);

  // 保存内容到服务器
  const saveToServer = useCallback(async (content: T): Promise<boolean> => {
    try {
      // 从 localStorage 读取管理员密码
      let adminPassword = 'XueJian0812511';
      try {
        const siteSettingsRaw = localStorage.getItem('__youpei_site_settings');
        if (siteSettingsRaw) {
          const siteSettings = JSON.parse(siteSettingsRaw);
          if (siteSettings.adminPassword) {
            adminPassword = siteSettings.adminPassword;
          }
        }
      } catch {
        // 忽略读取错误，使用默认密码
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify(content),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`Failed to save ${contentType} to server:`, response.status, error);
        return false;
      }
      const result = await response.json();
      return result.success === true;
    } catch (e) {
      console.error(`Error saving ${contentType} to server:`, e);
      return false;
    }
  }, [API_ENDPOINT, contentType]);

  // 组件挂载时从服务器读取内容
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const serverData = await fetchFromServer();
      if (!cancelled) {
        if (serverData !== null) {
          setData(serverData);
        }
        setLoaded(true);
        initializedRef.current = true;
      }
    };

    init();
    return () => { cancelled = true; };
  }, [fetchFromServer]);

  // 更新内容：同时保存到服务器和本地状态
  const updateData = useCallback(async (updates: Partial<T> | ((prev: T) => T)): Promise<boolean> => {
    setSyncing(true);
    setSyncError(null);

    try {
      let newData: T;
      setData(prev => {
        if (typeof updates === 'function') {
          newData = (updates as (prev: T) => T)(prev);
        } else {
          newData = { ...prev, ...updates };
        }
        return newData;
      });

      // 等待状态更新（简单延迟）
      await new Promise(r => setTimeout(r, 50));

      const serverSuccess = await saveToServer(newData);
      if (!serverSuccess) {
        setSyncError('保存到服务器失败，修改仅在本地生效。请检查网络或管理员密码。');
        return false;
      }

      return true;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setSyncError(errorMsg);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [saveToServer]);

  // 替换全部内容
  const replaceData = useCallback(async (newData: T): Promise<boolean> => {
    setSyncing(true);
    setSyncError(null);

    try {
      setData(newData);
      await new Promise(r => setTimeout(r, 50));

      const serverSuccess = await saveToServer(newData);
      if (!serverSuccess) {
        setSyncError('保存到服务器失败，修改仅在本地生效。请检查网络或管理员密码。');
        return false;
      }

      return true;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setSyncError(errorMsg);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [saveToServer]);

  // 手动从服务器刷新
  const refreshFromServer = useCallback(async () => {
    setSyncing(true);
    try {
      const serverData = await fetchFromServer();
      if (serverData !== null) {
        setData(serverData);
        setSyncError(null);
        return true;
      }
      return false;
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : String(e));
      return false;
    } finally {
      setSyncing(false);
    }
  }, [fetchFromServer]);

  return {
    data,
    loaded,
    syncing,
    syncError,
    updateData,      // 部分更新
    replaceData,     // 全部替换
    refreshFromServer, // 手动刷新
    setData,         // 仅本地设置（不保存到服务器）
  };
}
