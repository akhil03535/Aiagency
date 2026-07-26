import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import businessProfileService from '../services/businessProfile.service';

/**
 * Loads the user's business profiles and exposes CRUD actions.
 * Most users will only ever have one profile, but the API supports many.
 */
export function useBusinessProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await businessProfileService.list();
      setProfiles(data);
    } catch (_err) {
      toast.error('Could not load business profiles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProfile = useCallback(
    async (payload) => {
      const profile = await businessProfileService.create(payload);
      await refresh();
      return profile;
    },
    [refresh]
  );

  const updateProfile = useCallback(
    async (id, payload) => {
      const profile = await businessProfileService.update(id, payload);
      await refresh();
      return profile;
    },
    [refresh]
  );

  const deleteProfile = useCallback(
    async (id) => {
      await businessProfileService.remove(id);
      await refresh();
    },
    [refresh]
  );

  const setDefaultProfile = useCallback(
    async (id) => {
      await businessProfileService.setDefault(id);
      await refresh();
    },
    [refresh]
  );

  return {
    profiles,
    isLoading,
    refresh,
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
  };
}
