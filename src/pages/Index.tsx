import { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/sections/Dashboard';
import ShipmentCard from '@/components/sections/ShipmentCard';
import EpdManagement from '@/components/sections/EpdManagement';
import Participants from '@/components/sections/Participants';
import History from '@/components/sections/History';
import Settings from '@/components/sections/Settings';
import type { Role } from '@/data/mockData';

export default function Index() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeRole, setActiveRole] = useState<Role>('carrier');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard role={activeRole} onSectionChange={setActiveSection} />;
      case 'card':
        return <ShipmentCard role={activeRole} />;
      case 'epd':
        return <EpdManagement role={activeRole} />;
      case 'participants':
        return <Participants role={activeRole} />;
      case 'history':
        return <History role={activeRole} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard role={activeRole} onSectionChange={setActiveSection} />;
    }
  };

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      activeRole={activeRole}
      onRoleChange={setActiveRole}
    >
      {renderSection()}
    </Layout>
  );
}
