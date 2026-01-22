"use client";

import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";

export default function SettingPage() {
  return (
    <GuardedLayout headerTitle="Pengaturan" headerSubtitle="Sesuaikan dengan preference">
      <HeadMetaData title="Setting" pathName="/setting" />
      setting
    </GuardedLayout>
  );
}
