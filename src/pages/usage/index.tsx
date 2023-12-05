import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/Usage').then((mod) => mod.default));
export default Page;
