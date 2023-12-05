import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/components/admin/Admin'), { ssr: false });
const AdminPage = () => <App />;
export default AdminPage;
