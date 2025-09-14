import Wave from './Wave';
export default function WaveGreen(props: any) {
  return <Wave {...props} colors={['#DCFCE7', '#BBF7D0', 'var(--color-primary, #10B981)']} />;
}