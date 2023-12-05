import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/PrivacyPolicy').then((mod) => mod.default));
export default Page;
