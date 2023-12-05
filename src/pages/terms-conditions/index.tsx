import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/TermsConditions').then((mod) => mod.default));
export default Page;
