export default function getDomain() {
  return process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:3000';
}
