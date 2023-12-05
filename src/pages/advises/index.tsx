import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/Advises').then((mod) => mod.default));
export default Page;
