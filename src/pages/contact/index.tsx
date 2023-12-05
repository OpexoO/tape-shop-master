import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/Contact').then((mod) => mod.default));
export default Page;
