'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackupPage = () => {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7240/api/Backup/download');

      if (!response.ok) throw new Error('Backup failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      const contentDisposition = response.headers.get('Content-Disposition');
      const match = contentDisposition?.match(/filename="?(.+)"?/);
      const fileName = match?.[1] || 'backup.bak';

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert('✅ Backup successful!');
    } catch (err) {
      console.error(err);
      alert('❌ Backup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-center bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📦 Backup Database</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Click the button below to export a `.bak` file of your database.
      </p>
      <Button onClick={handleBackup} disabled={loading}>
        <Download size={18} className="mr-2" />
        {loading ? 'Backing up...' : 'Download Backup'}
      </Button>
    </div>
  );
};

export default BackupPage;
