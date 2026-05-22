import { redirect } from 'next/navigation';

export default function MonitoringRedirect() {
  redirect('/live-checks');
}
