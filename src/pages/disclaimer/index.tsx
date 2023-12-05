import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/Disclaimer').then((mod) => mod.default));
export default Page;
