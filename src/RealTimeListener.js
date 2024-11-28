import { useEffect } from 'react';
import { supabase } from './supabaseClient';

const RealTimeListener = () => {
  useEffect(() => {
    const subscription = supabase
      .from('your-table-name')
      .on('*', (payload) => {
        console.log('Change received!', payload);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return <div>Listening for real-time updates...</div>;
};

export default RealTimeListener;
