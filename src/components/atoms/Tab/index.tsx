interface TabComponentProps {
  tabs: Record<string, string>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Tab({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);

  return (
    <div className='flex border-b-1 border-grey-10 no-scrollbar overflow-x-auto gap-1.5'>
      {tabEntries.map(([label, value]) => {
        const isSelected = currentTab === value;
        return (
          <button
            key={value}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`tab-panel-${value}`}
            onClick={() => setCurrentTab(value)}
            className={`
                flex-1 p-1 px-3 md:p-3 md:text-title02 text-body02 cursor-pointer whitespace-nowrap
                ${isSelected ? 'text-blue-35 border-b-2 border-blue-35' : 'text-grey-40'}
              `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
