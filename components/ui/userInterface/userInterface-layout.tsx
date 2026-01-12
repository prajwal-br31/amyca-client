"use client";

import { ConfigureWizard } from "@/components/configure-steps";

interface ConfigureLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function UserInterfaceLayoutLayout({
  title = "Configure Contact Centre",
  description,
}: ConfigureLayoutProps) {
  return (
    <div className="max-w- mx-auto">
      <div className="text-center mb-12">
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      <ConfigureWizard />
    </div>
  );
}
