type AdminHeaderProps = {
  title: string;
  description: string;
  meta?: string;
};

export function AdminHeader({ title, description, meta }: AdminHeaderProps) {
  return (
    <header className="mb-8">
      <p className="nexora-eyebrow mb-2 text-[10px]">Nexora AI Admin</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-nexora-text sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-nexora-muted sm:text-base">
            {description}
          </p>
        </div>
        {meta && (
          <p className="shrink-0 text-xs font-medium text-nexora-muted">{meta}</p>
        )}
      </div>
    </header>
  );
}
