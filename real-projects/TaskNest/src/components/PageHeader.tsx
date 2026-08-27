type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">TaskNest</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-500">{description}</p>
      </div>
      {action}
    </header>
  );
}
