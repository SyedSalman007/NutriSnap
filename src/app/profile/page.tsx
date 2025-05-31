import { ProfileForm } from '@/components/ProfileForm';
import { PageContainer } from '@/components/PageContainer';

export default function ProfilePage() {
  return (
    <PageContainer title="Manage Your Profile">
      <ProfileForm />
    </PageContainer>
  );
}
