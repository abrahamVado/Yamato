import Wave from './Wave';
export default function WavePurple(props: any) {
  return <Wave {...props} colors={['#EDE9FE', '#C4B5FD', 'var(--color-primary, #4F46E5)']} />;
}